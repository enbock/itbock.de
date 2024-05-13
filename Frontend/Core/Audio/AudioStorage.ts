export interface AudioBuffer {
    text: string,
    audio: string
}

export default interface AudioStorage {
    getBuffer(): Array<AudioBuffer>;

    setBuffer(buffer: Array<AudioBuffer>): void;

    getPlayingText(): AudioBuffer;

    setPlayingText(text: AudioBuffer): void;

    setPlaying(playing: boolean): void;

    getPlaying(): boolean;

    getMicrophoneMuted(): boolean;

    setMicrophoneMuted(muted: boolean): void;

    getLoading(): boolean;

    setLoading(isLoading: boolean): void;

    getListening(): boolean;

    setListening(isListening: boolean): void;

    getSuspended(): boolean;

    setSuspended(suspend: boolean): void;
}
