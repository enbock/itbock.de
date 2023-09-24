import StartStorage from 'Core/Start/StartStorage';

export default class Memory implements StartStorage {
    private started: boolean = false;

    public getApplicationStarted(): boolean {
        return this.started;
    }

    public setApplicationStarted(started: boolean): void {
        this.started = started;
    }
}