export default class UIAudioInputElement extends HTMLElement {
    public onaudioinput: (event: CustomEvent<string>) => void = () => <never>false;
    public onaudioabort: (event: Event) => void = () => <never>false;
    private isListening: boolean = false;
    private mediaRecorder?: MediaRecorder;
    private lastRecordedChunks: Array<Blob> = [];
    private allChunks: Array<Blob> = [];
    private silenceTimeoutId?: number;
    private detectedStartOfSpeech: boolean = false;
    private stream?: MediaStream;
    private silentCounter: number = 0;
    private maxSilentCounter: number = 30;
    private enabled: boolean = false;
    private doListening: boolean = false;
    private highestRMS: number = 0;
    private lowestRMS: number = Infinity;
    private rmsThresholdFactor: number = 0.8;

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
            const rms: number = await this.calculateRMS(audioBlob);
            this.updateRMSRange(rms);

            const rmsThresholdHigh: number = this.highestRMS * this.rmsThresholdFactor;
            const rmsThresholdLow: number = (this.lowestRMS * (2 - this.rmsThresholdFactor)) * 2;
            const diffThreshold: number = 1 - (1 / this.highestRMS * this.lowestRMS);
            const minGainDetected: boolean = diffThreshold > 0 && diffThreshold > this.rmsThresholdFactor;

            this.innerText = rmsThresholdLow + ' || ' + rms + ' || ' + rmsThresholdHigh + ' >> ' + diffThreshold;

            if (this.detectedStartOfSpeech) {
                if (rms < rmsThresholdLow && minGainDetected) {
                    this.detectedStartOfSpeech = false;
                    const fullAudioBlob: Blob = new Blob(this.allChunks);
                    this.allChunks = [];
                    const base64Audio: string = await this.blobToBase64(fullAudioBlob);
                    const audioInputEvent: CustomEvent<string> = new CustomEvent('audioinput', {detail: base64Audio});
                    this.dispatchEvent(audioInputEvent);
                    this.onaudioinput(audioInputEvent);
                    this.disableMediaRecorder();
                } else {
                    this.startMediaRecording();
                }
            } else {
                if (rms > rmsThresholdHigh || (rms > rmsThresholdLow && rmsThresholdLow < 0.1)) {
                    this.detectedStartOfSpeech = true;
                    this.startMediaRecording();
                } else {
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

    private async calculateRMS(audioBlob: Blob): Promise<number> {
        const audioContext: AudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const arrayBuffer: ArrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawData: Float32Array = audioBuffer.getChannelData(0);
        let sumOfSquares: number = 0;
        for (let i = 0; i < rawData.length; i++) {
            sumOfSquares += rawData[i] * rawData[i];
        }
        return Math.sqrt(sumOfSquares / rawData.length);
    }

    private updateRMSRange(rms: number): void {
        if (rms > this.highestRMS) {
            this.highestRMS = rms;
        }
        if (rms < this.lowestRMS) {
            this.lowestRMS = rms;
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

    private disableMediaRecorder(): void {
        this.stopMediaRecording();
        this.stream?.getTracks().forEach(track => track.stop());
        this.stream = undefined;
        this.mediaRecorder = undefined;
        this.isListening = false;
        this.lastRecordedChunks = [];
        this.allChunks = [];
        this.silenceTimeoutId = undefined;
        this.detectedStartOfSpeech = false;
        this.silentCounter = 0;
        this.highestRMS = 0;
        this.lowestRMS = Infinity;
    }
}

customElements.define('audio-input', UIAudioInputElement);
