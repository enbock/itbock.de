import StartStorage from 'Core/Start/StartStorage';

export default class Memory implements StartStorage {
    private started: boolean = false;
    private language: string = '';

    public getApplicationStarted(): boolean {
        return this.started;
    }

    public setApplicationStarted(started: boolean): void {
        this.started = started;
    }

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }
}
