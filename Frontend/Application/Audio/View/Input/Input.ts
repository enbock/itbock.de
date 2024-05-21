import RootComponent from 'Application/RootComponent';
import InputModel from 'Application/Audio/View/Input/InputModel';
import Adapter from 'Application/Audio/Adapter';

export default class Input implements RootComponent {
    private isListening: boolean = false;
    private modelInstance: InputModel = new InputModel();
    private mediaRecorder?: MediaRecorder;
    private lastRecordedChunks: Array<Blob> = [];
    private allChunks: Array<Blob> = [];
    private silenceTimeoutId?: number;
    private initialRMSList: Array<number> = [];
    private initialRMS: number = 1;
    private detectedStartOfSpeech: boolean = false;
    private stream?: MediaStream;
    private silentCounter: number = 0;
    private maxSilentCounter: number = 60;

    constructor(
        private adapter: Adapter
    ) {
    }

    public get model(): InputModel {
        return this.modelInstance;
    }

    public set model(model: InputModel) {
        this.modelInstance = model;

        if (this.model.microphoneEnabled == false) this.disableMediaRecorder();
        else {
            if (this.model.doListening == true) this.start();
            else this.stop();
        }
    }

    private start(): void {
        if (this.isListening) return;
        this.isListening = true;

        void this.startRecording();
    }

    private async startRecording(): Promise<void> {
        try {
            if (!this.stream) {
                this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
            }
            if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
                this.mediaRecorder = new MediaRecorder(this.stream);
                this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
                    this.lastRecordedChunks.push(event.data);
                    this.resetSilenceTimeout();
                };

                this.mediaRecorder.onstop = async (): Promise<void> => {
                    const audioBlob: Blob = new Blob(this.lastRecordedChunks, {type: 'audio/wav'});
                    this.allChunks.push(...this.lastRecordedChunks);
                    this.lastRecordedChunks = [];
                    if (await this.isSilentAudio(audioBlob)) {
                        if (this.detectedStartOfSpeech) {
                            this.detectedStartOfSpeech = false;
                            const fullAudioBlob: Blob = new Blob(this.allChunks, {type: 'audio/wav'});
                            this.allChunks = [];
                            void this.adapter.audioBlobInput(fullAudioBlob);
                        } else {
                            this.allChunks = [];
                            console.log('Silent audio detected, not sending for transcription');
                            this.silentCounter++;
                            if (this.silentCounter < this.maxSilentCounter)
                                this.mediaRecorder!.start();
                            else
                                void this.adapter.audioAbort();
                        }
                    } else {
                        this.detectedStartOfSpeech = true;
                        this.mediaRecorder!.start();
                    }
                };
            }

            this.mediaRecorder.start();
            await this.calculateInitialRMS(this.stream);
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
        }, 1000);
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
        await audioContext.audioWorklet.addModule('worklet-processor.js');
        const source: MediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
        const audioWorkletNode: AudioWorkletNode = new AudioWorkletNode(audioContext, 'rms-processor');

        source.connect(audioWorkletNode);
        audioWorkletNode.port.onmessage = (event: MessageEvent) => {
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

    private disableMediaRecorder(): void {

    }
}
