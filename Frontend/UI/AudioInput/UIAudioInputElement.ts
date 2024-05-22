export default class UIAudioInputElement extends HTMLElement {
    public onaudioinput: (event: CustomEvent<string>) => void = () => <never>false;
    public onaudioabort: (event: Event) => void = () => <never>false;
    private isListening: boolean = false;
    private mediaRecorder?: MediaRecorder;
    private lastRecordedChunks: Array<Blob> = [];
    private allChunks: Array<Blob> = [];
    private silenceTimeoutId?: number;
    private initialRMSList: Array<number> = [];
    private initialRMS: number = 1;
    private detectedStartOfSpeech: boolean = false;
    private stream?: MediaStream;
    private silentCounter: number = 0;
    private maxSilentCounter: number = 30;
    private enabled: boolean = false;
    private doListening: boolean = false;

    public static get observedAttributes(): Array<string> {
        return ['dolistening', 'enabled'];
    }

    public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        const refreshCommand: Function | undefined = <Function | undefined>this[<keyof this>('refresh_' + name)];
        if (refreshCommand) refreshCommand.call(this, newValue);
    }

    private refresh_silentcounter(newValue: string | null): void {
        this.maxSilentCounter = newValue !== null ? parseInt(newValue) : this.maxSilentCounter;
    }

    private refresh_dolistening(newValue: string | null): void {
        this.doListening = newValue != null;

        if (this.doListening) {
            this.start();
        } else {
            this.stop();
        }
    }

    private refresh_enabled(newValue: string | null): void {
        this.enabled = newValue != null;

        if (this.enabled) return;
        this.disableMediaRecorder();
    }

    private start(): void {
        if (this.isListening) return;
        this.isListening = true;
        this.silentCounter = 0;

        void this.startRecording();
    }

    private stop(): void {
        if (!this.isListening) return;
        this.isListening = false;
        this.stopMediaRecording();
    }

    private async startRecording(): Promise<void> {
        try {
            if (!this.stream) {
                this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
            }
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                this.mediaRecorder = new MediaRecorder(this.stream);
                this.mediaRecorder.ondataavailable = this.onDataAvailable.bind(this);
                this.mediaRecorder.onstop = () => this.handleStop();
            }

            this.startMediaRecording();
            await this.calculateInitialRMS(this.stream);
        } catch (error) {
            console.error('Error accessing microphone', error);
        }
    }

    private onDataAvailable(event: BlobEvent) {
        this.lastRecordedChunks.push(event.data);
        this.resetSilenceTimeout();
    }

    private async handleStop(): Promise<void> {
        if (!this.isListening) return;

        const audioBlob: Blob = new Blob(this.lastRecordedChunks);
        this.allChunks.push(...this.lastRecordedChunks);
        this.lastRecordedChunks = [];
        try {
            if (await this.isSilentAudio(audioBlob)) {
                if (this.detectedStartOfSpeech) {
                    this.detectedStartOfSpeech = false;
                    const fullAudioBlob: Blob = new Blob(this.allChunks);
                    this.allChunks = [];
                    this.silentCounter = 0;
                    const base64Audio: string = await this.blobToBase64(fullAudioBlob);
                    const audioInputEvent: CustomEvent<string> = new CustomEvent('audioinput', {detail: base64Audio});
                    this.dispatchEvent(audioInputEvent);
                    this.onaudioinput(audioInputEvent);
                    this.disableMediaRecorder();
                } else {
                    this.allChunks = [];
                    this.silentCounter++;
                    if (this.silentCounter < this.maxSilentCounter) {
                        this.startMediaRecording();
                    } else {
                        const event: Event = new Event('audioabort');
                        this.dispatchEvent(event);
                        this.onaudioabort(event);
                        this.disableMediaRecorder();
                    }
                }
            } else {
                this.silentCounter = 0;
                this.detectedStartOfSpeech = true;
                this.startMediaRecording();
            }
        } catch (error) {
            console.error('Audio decode error', error);
        }
    };

    private startMediaRecording(): void {
        if (!this.mediaRecorder) return;

        if (this.mediaRecorder.state == 'recording') return;

        this.mediaRecorder.start();
        this.resetSilenceTimeout();
    }

    private resetSilenceTimeout(): void {
        if (this.silenceTimeoutId) clearTimeout(this.silenceTimeoutId);

        this.silenceTimeoutId = window.setTimeout((): void => {
            this.stopMediaRecording();
        }, 1000);
    }

    private stopMediaRecording(): void {
        if (this.silenceTimeoutId) clearTimeout(this.silenceTimeoutId);
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
    }

    private async isSilentAudio(audioBlob: Blob): Promise<boolean> {
        const audioContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer: ArrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData: Float32Array = audioBuffer.getChannelData(0);
        const samples: number = 100;
        const blockSize: number = Math.floor(rawData.length / samples);
        let sum: number = 0;

        for (let i = 0; i < samples; i++) {
            const blockStart: number = blockSize * i;
            let sumOfSquares: number = 0;
            for (let j = 0; j < blockSize; j++) {
                const sample: number = rawData[blockStart + j];
                sumOfSquares += sample * sample;
            }
            const rms: number = Math.sqrt(sumOfSquares / blockSize);
            sum += rms;
        }

        const averageRMS: number = sum / samples;
        return averageRMS < this.initialRMS;
    }

    private async calculateInitialRMS(stream: MediaStream): Promise<void> {
        const audioContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        await audioContext.audioWorklet.addModule('ui-audio-input-processor.js');
        const source: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const audioWorkletNode: AudioWorkletNode = new AudioWorkletNode(audioContext, 'rms-processor');

        source.connect(audioWorkletNode);
        audioWorkletNode.port.onmessage = (event: MessageEvent): void => {
            const rms: number = event.data;
            if (rms > 0) {
                this.initialRMSList.push(rms);
                if (this.initialRMSList.length < 10) return;
                this.initialRMS = this.initialRMSList.reduce((sum, r) => sum + r, 0) / this.initialRMSList.length;
                audioWorkletNode.disconnect();
                source.disconnect();
            }
        };
    }

    private async blobToBase64(blob: Blob): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    private disableMediaRecorder(): void {
        this.stopMediaRecording();
        this.stream?.getTracks().forEach(track => track.stop());
        this.stream = undefined;
        this.mediaRecorder = undefined;
        this.isListening = false;
        this.lastRecordedChunks = [];
        this.allChunks = [];
        this.silenceTimeoutId = undefined;
        this.initialRMSList = [];
        this.initialRMS = 1;
        this.detectedStartOfSpeech = false;
        this.silentCounter = 0;
    }
}

customElements.define('audio-input', UIAudioInputElement);
