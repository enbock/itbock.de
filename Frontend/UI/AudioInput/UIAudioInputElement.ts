// noinspection JSUnusedGlobalSymbols
export default class UIAudioInputElement extends HTMLElement {
    public onaudioinput: (event: CustomEvent<string>) => void = () => <never>false;
    public onaudioabort: (event: Event) => void = () => <never>false;
    private isListening: boolean = false;
    private stream?: MediaStream;
    private audioContext?: AudioContext;
    private audioWorkletNode?: AudioWorkletNode;
    private micEnabled: boolean = false;
    private doListening: boolean = false;
    private detectedStartOfSpeech: boolean = false;
    private highestRMS: number = 0;
    private rmsThresholdFactor: number = 0.8;
    private mediaRecorder?: MediaRecorder;
    private recordedChunks: Array<Blob> = [];
    private silenceStartTime?: number;
    private rmsMinMultiplier: number = 20;
    private rmsFirstSecond: number = 0;
    private recordStartTime: number = 0;
    private avgMeasureTime: number = 1500;

    public static get observedAttributes(): Array<string> {
        return ['listening', 'enabled'];
    }

    public set listening(newValue: string | null) {
        this.doListening = newValue != null;

        if (this.doListening) {
            void this.start();
        } else {
            this.stop();
        }
    }

    public set enabled(newValue: string | null) {
        this.micEnabled = newValue != null;

        if (this.micEnabled) return;

        this.mediaRecorder?.stop();
        this.disableMicrophone();
    }

    public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        (<any>this)[<keyof this>(name)] = newValue;
    }

    private async handleStop(): Promise<void> {
        if (this.micEnabled) await this.handleEndOfRecording();
        this.disableMicrophone();
    }

    private async handleEndOfRecording(): Promise<void> {
        if (this.detectedStartOfSpeech) {
            const fullAudioBlob: Blob = new Blob(this.recordedChunks);
            const base64Audio: string = await this.blobToBase64(fullAudioBlob);
            const audioInputEvent: CustomEvent<string> = new CustomEvent('input', {detail: base64Audio});
            this.dispatchEvent(audioInputEvent);
            this.onaudioinput(audioInputEvent);
        } else {
            const event: Event = new Event('abort');
            this.dispatchEvent(event);
            this.onaudioabort(event);
        }
    }

    private async start(): Promise<void> {
        if (this.isListening) return;
        this.isListening = true;
        await this.startMicrophone();
    }

    private stop(): void {
        if (this.isListening) this.mediaRecorder?.stop();
        this.disableMicrophone();
    }

    private async startMicrophone(): Promise<void> {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            await this.audioContext.audioWorklet.addModule('ui-audio-input-processor.js');
            this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const source: MediaStreamAudioSourceNode = this.audioContext.createMediaStreamSource(this.stream);
            this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'rms-processor');
            this.audioWorkletNode.port.onmessage = (event: MessageEvent) => this.handleRMS(event.data);
            source.connect(this.audioWorkletNode);

            this.mediaRecorder = new MediaRecorder(this.stream);
            this.mediaRecorder.ondataavailable = this.handleData.bind(this);
            this.mediaRecorder.onstop = () => this.handleStop();
            this.mediaRecorder.start();
        } catch (error) {
            console.error('Error accessing microphone', error);
        }
    }

    private handleData(event: BlobEvent) {
        if (this.detectedStartOfSpeech) this.recordedChunks.push(event.data);
    }

    private async handleRMS(rms: number): Promise<void> {
        if (rms > this.highestRMS) {
            this.highestRMS = rms;
        }

        const rmsThresholdHigh: number = this.highestRMS * this.rmsThresholdFactor;
        const rmsThresholdLow: number = (rms * (2 - this.rmsThresholdFactor)) * 2;
        const diffThreshold: number = 1 / rmsThresholdLow * this.highestRMS;
        const minGainDetected: boolean = diffThreshold > this.rmsMinMultiplier;
        const now: number = Date.now();

        if (this.recordStartTime == 0) this.recordStartTime = now;
        if (now - this.recordStartTime <= this.avgMeasureTime) {
            if (rms > this.rmsFirstSecond) this.rmsFirstSecond = rms;
        } else {
            if (this.rmsFirstSecond > rmsThresholdHigh && minGainDetected) this.detectedStartOfSpeech = true;
        }

        this.detectedStartOfSpeech = this.detectedStartOfSpeech || minGainDetected;

        if (!this.detectedStartOfSpeech) return;

        if (rms < rmsThresholdHigh) {
            if (!this.silenceStartTime) {
                this.silenceStartTime = now;
            } else if (now - this.silenceStartTime >= this.avgMeasureTime) {
                this.mediaRecorder?.stop();
            }
        } else {
            this.silenceStartTime = undefined;
        }
    }

    private async blobToBase64(blob: Blob): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    private disableMicrophone(): void {
        this.stream?.getTracks().forEach(track => track.stop());
        this.audioWorkletNode?.disconnect();
        if (this.audioContext?.state != 'closed') this.audioContext?.close();
        this.isListening = false;
        this.detectedStartOfSpeech = false;
        this.highestRMS = 0;
        this.silenceStartTime = undefined;
        this.rmsFirstSecond = 0;
        this.recordStartTime = 0;

        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.recordedChunks = [];
    }
}

customElements.define('audio-input', UIAudioInputElement);
