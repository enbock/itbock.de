import Adapter from 'Application/Start/Adapter';
import AudioInputModel from 'Application/Start/View/Audio/AudioInputModel';
import UIAudioInputElement from 'UI/AudioInput/UIAudioInputElement';

export default class AudioInput {
    private modelInstance: AudioInputModel = new AudioInputModel();
    private readonly root: UIAudioInputElement;

    constructor(
        private readonly document: Document,
        private readonly adapter: Adapter
    ) {
        this.root = this.document.createElement('audio-input') as UIAudioInputElement;
        this.root.setAttribute('aria-hidden', 'true');
        this.root.onaudioinput = (event: CustomEvent<string>): void => {
            void this.adapter.audioBlobInput(event.detail as string);
        };
    }

    get element(): HTMLElement {
        return this.root;
    }

    set model(value: AudioInputModel) {
        this.modelInstance = value;
        this.render();
    }

    private render(): void {
        const model: AudioInputModel = this.modelInstance;

        if (model.doListening) {
            this.root.setAttribute('listening', '');
        } else {
            this.root.removeAttribute('listening');
        }

        if (model.microphoneEnabled) {
            this.root.setAttribute('enabled', '');
        } else {
            this.root.removeAttribute('enabled');
        }
    }
}
