import RootComponent from 'Application/RootComponent';
import InputModel from 'Application/Audio/View/Input/InputModel';
import Adapter from 'Application/Audio/Adapter';

export default class Input implements RootComponent {
    private isListening: boolean = false;
    private recognition?: SpeechRecognition;
    private modelInstance: InputModel = new InputModel();
    private lastResult: string = '';

    constructor(
        private recognitionClass: typeof SpeechRecognition,
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

    private onResult: Callback<(e: Event) => void> = (e: Event) => this.recognitionResult(e);

    private onEnd: Callback<() => void> = () => this.completeInput();

    private start(): void {
        if (this.isListening || this.model.doListening == false) return;
        this.isListening = true;

        if (!this.recognition) {
            this.recognition = new (this.recognitionClass)();
            if (!this.recognition) return;
            this.recognition.lang = 'de-DE';
            this.recognition.addEventListener('result', this.onResult);
            this.recognition.addEventListener('end', this.onEnd);
        }

        this.recognition.start();
    }

    private recognitionResult(event: any): any {
        const text: string = (((event['results'] || [])[0] || [])[0] || {}).transcript || '';
        if (!text) {
            return;
        }
        this.lastResult = text;
        this.stop();
    }


    private stop(): void {
        if (!this.recognition || !this.isListening) return;
        this.recognition.stop();
        this.isListening = false;
    }

    private completeInput(): void {
        if (this.lastResult == '') {
            this.start();
            return;
        }

        if (this.recognition) {
            this.recognition.removeEventListener('result', this.onResult);
            this.recognition.removeEventListener('end', this.onEnd);
        }
        this.recognition = undefined;

        console.log('Erkannte Eingabe: %c' + this.lastResult, 'font-style: italic; color: green');
        void this.adapter.speechInput(this.lastResult);
    }
}
