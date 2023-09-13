import AudioStorage from 'Core/Audio/AudioStorage';

export default class AudioService {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public getAudioText(): string {
        const buffer: Array<string> = this.audioStorage.getBuffer();
        if (buffer.length == 0) return '';
        
        const text: string = buffer.join(' ');
        this.audioStorage.setBuffer([]);
        this.audioStorage.setPlaying(true);

        return text;
    }

    public addAudioText(text: string): void {
        const buffer: Array<string> = this.audioStorage.getBuffer();
        buffer.push(text);
        this.audioStorage.setBuffer(buffer);
    }
}
