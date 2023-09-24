import AudioStorage from 'Core/Audio/AudioStorage';

export default class InputUseCase {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public mute(): void {
        this.audioStorage.setMicrophoneMuted(true);
    }
}
