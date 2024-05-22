import AudioModel from 'Application/Audio/View/AudioModel';
import StateResponse from 'Application/Audio/Controller/StateResponse';

export default class AudioPresenter {
    public present(data: StateResponse): AudioModel {
        const model: AudioModel = new AudioModel();

        this.presentTextToAudio(model, data);
        model.isLoading = data.isLoading == true;
        model.doListening = data.audioInputEnabled == true;
        model.microphoneEnabled = data.microphoneEnable == true;

        return model;
    }

    private presentTextToAudio(model: AudioModel, data: StateResponse): void {
        const doAudioOutput: boolean = data.audioOutput.text != '' && data.audioOutput.audio != '';

        if (doAudioOutput) {
            model.outputText = data.audioOutput.text;
            model.outputAudio = this.base64ToBlob(data.audioOutput.audio);
        }
        model.showAudio = doAudioOutput;
    }

    private base64ToBlob(base64: string): Blob {
        const byteCharacters: string = atob(base64);
        const byteNumbers: Array<number> = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray: Uint8Array = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: 'audio/mpeg'});
    }
}
