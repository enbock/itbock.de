import RootComponent from 'Application/RootComponent';
import InputModel from 'Application/Audio/View/Input/InputModel';
import Adapter from 'Application/Audio/Adapter';

export default class Input implements RootComponent {
    private isListening: boolean = false;
    private modelInstance: InputModel = new InputModel();
    private mediaRecorder?: MediaRecorder;
    private audioChunks: Array<Blob> = [];
    private silenceTimeoutId?: number;

    constructor(
        private adapter: Adapter
    ) {
    }

    public get model(): InputModel {
        return this.modelInstance;
    }

    public set model(model: InputModel) {
        this.modelInstance = model;

        console.log('>>>', model);
        if (this.model.doListening == true) this.start();
        else this.stop();
    }

    private start(): void {
        if (this.isListening) return;
        this.isListening = true;

        void this.startRecording();
    }

    private async startRecording(): Promise<void> {
        try {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
            const mediaRecorder: MediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder = mediaRecorder;
            this.mediaRecorder.start();

            this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
                this.audioChunks.push(event.data);
                this.resetSilenceTimeout();
            };

            this.mediaRecorder.onstop = async () => {
                const audioBlob: Blob = new Blob(this.audioChunks, {type: 'audio/wav'});
                this.audioChunks = [];
                if (await this.isNonSilentAudio(audioBlob)) {
                    void this.adapter.audioBlobInput(audioBlob);
                } else {
                    console.log('Silent audio detected, not sending for transcription');
                    mediaRecorder.start();
                }
            };

            this.resetSilenceTimeout();
        } catch (error) {
            console.error('Error accessing microphone', error);
        }
    }

    private stop(): void {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
    }

    private resetSilenceTimeout(): void {
        if (this.silenceTimeoutId) clearTimeout(this.silenceTimeoutId);

        this.silenceTimeoutId = window.setTimeout(() => {
            this.stop();
            this.isListening = false;
        }, 5000);
    }

    private async isNonSilentAudio(audioBlob: Blob): Promise<boolean> {
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
        return averageRMS > 0.009;
    }
}
