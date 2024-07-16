import StartStorage from 'Core/Start/StartStorage';

export default class Memory implements StartStorage {
    private language: string = '';

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }
}
