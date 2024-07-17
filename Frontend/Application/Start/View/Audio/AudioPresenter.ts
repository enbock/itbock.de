import AudioInputModel from 'Application/Start/View/Audio/AudioInputModel';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import AudioOutputDevice from 'Application/Start/View/Audio/AudioOutputDevice';

export default class AudioPresenter {
    constructor(
        private audioOutputDevice: AudioOutputDevice
    ) {
    }

    public present(data: ResponseCollection): AudioInputModel {
        const model: AudioInputModel = new AudioInputModel();

        model.doListening = data.audioState.audioInputEnabled == true;
        model.microphoneEnabled = data.audioState.microphoneEnable == true;

        void this.audioOutputDevice.playAudio(data.audioState.audioOutput);

        return model;
    }
}
