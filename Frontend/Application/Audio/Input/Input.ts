import RootComponent from 'Application/RootComponent';
import InputModel from 'Application/Audio/Input/InputModel';
import Adapter from 'Application/Start/Adapter';

export default class Input implements RootComponent {
    private isListening: boolean = false;
    private recognition?: SpeechRecognition;
    private modelInstance: InputModel = new InputModel();

    constructor(
        private recognitionClass: typeof SpeechRecognition,
        private adapter: Adapter
    ) {
    }

    private recognitionResult(event: any): any {
        const text: string = (((event['results'] || [])[0] || [])[0] || {}).transcript || '';
        console.log('>>>??', text, event);
        if (!text) return;
        this.stop();
        void this.adapter.speechInput(text);
    }

    private stop(): void {
        if (!this.recognition) return;
        this.recognition.stop();
        this.recognition = undefined;
        this.isListening = false;
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

    private canPlay(): boolean {
        return this.modelInstance.takeSpeech == true && this.isListening == false;
    }

    private start(): void {
        if (!this.canPlay()) return;

        this.recognition = new (this.recognitionClass)();
        if (!this.recognition) return;
        this.recognition.lang = 'de-DE';
        this.recognition.addEventListener('result', (e) => this.recognitionResult(e));
        this.recognition.addEventListener('audioend', () => {
            this.stop();
            this.start();
        });
        this.recognition.start();
        this.isListening = true;
    }
}
