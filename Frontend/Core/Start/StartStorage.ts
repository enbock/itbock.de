export default interface StartStorage {
    getApplicationStarted(): boolean;

    setApplicationStarted(started: boolean): void;

    getMicrophoneMuted(): boolean;

    setMicrophoneMuted(muted: boolean): void;

    getShowLinks(): boolean;

    setShowLinks(show: boolean): void;
}
