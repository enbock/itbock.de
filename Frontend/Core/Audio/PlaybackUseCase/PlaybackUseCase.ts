import AudioStorage from 'Core/Audio/AudioStorage';

export default class PlaybackUseCase {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public endPlayback(): void {
        this.audioStorage.setPlaying(false);
    }
}
