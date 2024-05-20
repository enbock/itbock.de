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

        if (this.model.doListening == true) this.start();
        else this.stop();
    }

    private start(): void {
        if (this.isListening || this.model.doListening == false) return;
        this.isListening = true;

        this.startRecording();
    }

    private startRecording(): void {
        navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream: MediaStream) => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.start();

                this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
                    this.audioChunks.push(event.data);
                    this.resetSilenceTimeout();
                };

                this.mediaRecorder.onstop = () => {
                    const audioBlob: Blob = new Blob(this.audioChunks, {type: 'audio/wav'});
                    this.audioChunks = [];
                    void this.adapter.audioBlobInput(audioBlob);
                };

                this.resetSilenceTimeout();
            })
            .catch((error: any) => console.error('Error accessing microphone', error));
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
        }, 3000); // Stop recording after 3 seconds of silence
    }
}
