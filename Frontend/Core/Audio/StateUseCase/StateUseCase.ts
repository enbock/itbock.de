import AudioService from 'Core/Audio/AudioService';
import AudioStorage from 'Core/Audio/AudioStorage';
import Response from 'Core/Audio/StateUseCase/Response';

export default class StateUseCase {
    constructor(
        private audioService: AudioService,
        private audioStorage: AudioStorage
    ) {
    }

    public getState(response: Response, isLeader: boolean = true): void {
        const microphoneMuted: boolean = this.audioStorage.getMicrophoneMuted();

        response.audioOutput = isLeader ? this.audioService.getAudioContent() : {text: '', audio: ''};
        response.audioInputEnabled = isLeader && this.audioStorage.getListening() == true && microphoneMuted == false;
        response.microphoneEnable = isLeader && microphoneMuted == false;
        response.isAudioPlaying = isLeader && this.audioStorage.getPlaying();
    }
}
