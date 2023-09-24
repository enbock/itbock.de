export default interface StartStorage {
    getApplicationStarted(): boolean;

    setApplicationStarted(started: boolean): void;
}
