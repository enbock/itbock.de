import AudioModel from "Application/Audio/View/AudioModel";

export default class AudioPresenter {
    constructor(
        private soundServiceUrl: string
    ) {
    }

    public present(text: string): AudioModel {
        const model: AudioModel = new AudioModel();

        model.audioSource = this.soundServiceUrl + "?text=" + text;
        model.showAudio = text != "";

        return model;
    }
}
