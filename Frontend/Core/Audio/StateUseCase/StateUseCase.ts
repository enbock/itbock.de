import AudioService from 'Core/Audio/AudioService';
import AudioStorage from 'Core/Audio/AudioStorage';
import Response from 'Core/Audio/StateUseCase/Response';
import StartStorage from 'Core/Start/StartStorage';

export default class StateUseCase {
    constructor(
        private startStorage: StartStorage,
        private audioService: AudioService,
        private audioStorage: AudioStorage
    ) {
    }

    public getState(response: Response): void {
        if (this.startStorage.getApplicationStarted() == false) return;
        this.takeAudioText(response);
        response.isLoading = this.audioStorage.getLoading();
    }

    private takeAudioText(response: Response): void {
        response.textOutput = this.audioService.getAudioText();
        response.audioInputEnabled = this.audioStorage.getPlaying() == false && this.audioStorage.getMicrophoneMuted() == false;
    }
}
