import AudioStorage from 'Core/Audio/AudioStorage';

export default class AudioService {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public getAudioText(): string {
        if (this.audioStorage.getPlaying()) return this.audioStorage.getPlayingText();

        const buffer: Array<string> = this.audioStorage.getBuffer();
        if (buffer.length == 0) return '';

        const text: string = buffer.join(' ');
        this.audioStorage.setPlaying(true);
        this.audioStorage.setPlayingText(text);
        this.audioStorage.setBuffer([]);

        return text;
    }

    public addAudioText(text: string): void {
        const buffer: Array<string> = this.audioStorage.getBuffer();
        buffer.push(text);
        this.audioStorage.setBuffer(buffer);
    }
}
