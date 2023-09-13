import AudioStorage from 'Core/Audio/AudioStorage';

export default class Memory implements AudioStorage {
    private buffer: Array<string> = [];
    private playing: boolean = false;

    public getBuffer(): Array<string> {
        return this.buffer;
    }

    public setBuffer(buffer: Array<string>): void {
        this.buffer = buffer;
    }

    public setPlaying(playing: boolean): void {
        this.playing = playing;
    }

    public getPlaying(): boolean {
        return this.playing;
    }
}