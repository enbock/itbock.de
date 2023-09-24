export default interface AudioStorage {
    getBuffer(): Array<string>;

    setBuffer(buffer: Array<string>): void;

    getPlayingText(): string;

    setPlayingText(text: string): void;

    setPlaying(playing: boolean): void;

    getPlaying(): boolean;

    getMicrophoneMuted(): boolean;

    setMicrophoneMuted(muted: boolean): void;

    getLoading(): boolean;

    setLoading(isLoading: boolean): void;
}
