import RootComponent from 'Application/RootComponent';
import InputModel from 'Application/Audio/View/Input/InputModel';
import Adapter from 'Application/Audio/Adapter';

export default class Input implements RootComponent {
    private isListening: boolean = false;
    private recognition?: SpeechRecognition;
    private modelInstance: InputModel = new InputModel();

    constructor(
        private recognitionClass: typeof SpeechRecognition,
        private adapter: Adapter
    ) {
    }

    public set model(model: InputModel) {
        this.modelInstance = model;
        if (!this.canPlay()) {
            this.stop();
            return;
        }
        this.start();
        return;
    }

    private onAudioEnd: Callback<() => void> = () => this.debouncedAudioEnd();
    private onResult: Callback<(e: Event) => void> = (e: Event) => this.recognitionResult(e);

    private recognitionResult(event: any): any {
        const text: string = (((event['results'] || [])[0] || [])[0] || {}).transcript || '';
        if (!text) return;
        this.stop();
        void this.adapter.speechInput(text);
    }

    private stop(): void {
        if (!this.recognition) return;
        this.recognition.abort();
        this.recognition.removeEventListener('result', this.onResult);
        this.recognition.removeEventListener('audioend', this.onAudioEnd);
        this.recognition = undefined;
        this.isListening = false;
    }

    private canPlay(): boolean {
        return this.modelInstance.doListening == true && this.isListening == false;
    }

    private start(): void {
        if (!this.canPlay()) return;

        this.recognition = new (this.recognitionClass)();
        if (!this.recognition) return;
        this.recognition.lang = 'de-DE';
        this.recognition.addEventListener('result', this.onResult);
        this.recognition.addEventListener('audioend', this.onAudioEnd);
        this.recognition.start();
        this.isListening = true;
    }

    private debouncedAudioEnd(): void {
        setTimeout(() => this.restartInput(), 1000);
    };

    private restartInput(): void {
        if (!this.recognition) return;
        this.stop();
        this.start();
    }
}
