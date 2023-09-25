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

        this.createRecognitionInput();
        this.recognition!.start();
    }

    private createRecognitionInput(): void {
        if (this.recognition) return;

        this.recognition = new (this.recognitionClass)();
        if (!this.recognition) throw new Error('SpeechRecognition not found');

        this.recognition.lang = 'de-DE';
        this.recognition.addEventListener('result', this.onResult);
        this.recognition.addEventListener('end', this.onEnd);
    }

    private recognitionResult(event: any): any {
        const text: string = (((event['results'] || [])[0] || [])[0] || {}).transcript || '';
        if (!text) return;

        this.lastResult = text;
        this.stop();
    }

    private stop(): void {
        if (!this.recognition || !this.isListening) return;
        this.recognition.stop();
    }

    private completeInput(): void {
        this.isListening = false;

        if (this.lastResult == '') {
            this.start();
            return;
        }

        const result: string = this.lastResult;
        this.lastResult = '';
        console.log('Erkannte Eingabe: %c' + result, 'font-style: italic; color: green');
        void this.adapter.speechInput(result);
    }
}
