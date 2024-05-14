export default interface StartStorage {
    getApplicationStarted(): boolean;

    setApplicationStarted(started: boolean): void;

    getLanguage(): string;

    setLanguage(language: string): void;
}
