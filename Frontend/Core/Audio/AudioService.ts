import AudioStorage, {AudioBuffer} from 'Core/Audio/AudioStorage';

export default class AudioService {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public getAudioContent(): AudioBuffer {
        if (this.audioStorage.getPlaying()) return this.audioStorage.getPlayingText();

        const buffer: Array<AudioBuffer> = this.audioStorage.getBuffer();
        if (buffer.length == 0) return {text: '', audio: ''};

        const item: AudioBuffer = buffer.shift()!;
        this.audioStorage.setPlaying(true);
        this.audioStorage.setPlayingText(item);
        this.audioStorage.setBuffer(buffer);
        this.audioStorage.setLoading(true);

        return item;
    }

    public addAudioContent(text: string, audio: string): void {
        const buffer: Array<AudioBuffer> = this.audioStorage.getBuffer();
        buffer.push({text: text, audio: audio});
        this.audioStorage.setBuffer(buffer);
    }

    public continueWithoutText(): void {
        this.audioStorage.setListening(true);
    }
}
