import AudioService from 'Core/Audio/AudioService';
import AudioStorage from 'Core/Audio/AudioStorage';
import Response from 'Core/Audio/StateUseCase/Response';

export default class StateUseCase {
    constructor(
        private audioService: AudioService,
        private audioStorage: AudioStorage
    ) {
    }

    public getState(response: Response): void {
        response.audioOutput = this.audioService.getAudioContent();
        response.audioInputEnabled = this.audioStorage.getListening() == true && this.audioStorage.getMicrophoneMuted() == false;
        response.microphoneEnable = this.audioStorage.getMicrophoneMuted() == false;
        response.isAudioLoading = this.audioStorage.getLoading();
        response.isAudioPlaying = this.audioStorage.getPlaying();
    }
}
