import AudioModel from 'Application/Audio/View/AudioModel';
import StateResponse from 'Application/Audio/Controller/StateResponse';
import InputPresenter from 'Application/Audio/View/Input/InputPresenter';

export default class AudioPresenter {
    constructor(
        private soundServiceUrl: string,
        private inputPresenter: InputPresenter
    ) {
    }

    public present(data: StateResponse): AudioModel {
        const model: AudioModel = new AudioModel();

        this.presentTextToAudio(model, data);
        model.audioInput = this.inputPresenter.present(data);

        return model;
    }

    private presentTextToAudio(model: AudioModel, data: StateResponse): void {
        model.audioSource = this.soundServiceUrl + '?text=' + data.textOutput.replaceAll('\'', '');
        model.showAudio = data.textOutput != '';
    }
}
