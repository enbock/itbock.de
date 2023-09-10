import AudioStorage from 'Core/Audio/AudioStorage';

export default class AudioService {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public getAudioText(): string {
        const text: string = this.audioStorage.getBuffer().join(' ');
        this.audioStorage.setBuffer([]);

        return text;
    }

    public addAudioText(text: string): void {
        const buffer: Array<string> = this.audioStorage.getBuffer();
        buffer.push(text);
        this.audioStorage.setBuffer(buffer);
    }
}
