import AudioStorage from 'Core/Audio/AudioStorage';

export default class InputUseCase {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public initialize(): void {
        this.audioStorage.setMicrophoneMuted(true);
    }

    public inputFinished(): void {
        this.audioStorage.setListening(false);
    }

    public reset(): void {
        this.audioStorage.setMicrophoneMuted(false);
        this.audioStorage.setListening(false);
        this.audioStorage.setPlaying(false);
        this.audioStorage.setBuffer([]);
        this.audioStorage.setPlayingText({text: '', audio: ''});
    }

    public startInput(): void {
        this.audioStorage.setListening(true);
    }

    public mute(): void {
        this.audioStorage.setMicrophoneMuted(true);
    }
}
