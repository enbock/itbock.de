import AudioStorage from 'Core/Audio/AudioStorage';

export default class Memory implements AudioStorage {
    private buffer: Array<string> = [];
    private playBuffer: string = '';
    private playing: boolean = false;
    private microphoneMuted: boolean = false;
    private loading: boolean = false;
    private listening: boolean = false;
    private suspended: boolean = false;

    public getBuffer(): Array<string> {
        return this.buffer;
    }

    public setBuffer(buffer: Array<string>): void {
        this.buffer = buffer;
    }

    public getPlayingText(): string {
        return this.playBuffer;
    }

    public setPlayingText(text: string): void {
        this.playBuffer = text;
    }

    public setPlaying(playing: boolean): void {
        this.playing = playing;
    }

    public getPlaying(): boolean {
        return this.playing;
    }

    public getMicrophoneMuted(): boolean {
        return this.microphoneMuted;
    }

    public setMicrophoneMuted(muted: boolean): void {
        this.microphoneMuted = muted;
    }

    public getLoading(): boolean {
        return this.loading;
    }

    public setLoading(isLoading: boolean): void {
        this.loading = isLoading;
    }

    public getListening(): boolean {
        return this.listening;
    }

    public setListening(isListening: boolean): void {
        this.listening = isListening;
    }

    public getSuspended(): boolean {
        return this.suspended;
    }

    public setSuspended(suspend: boolean): void {
        this.suspended = suspend;
    }
}