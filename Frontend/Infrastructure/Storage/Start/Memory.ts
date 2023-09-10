import StartStorage from 'Core/Start/StartStorage';

export default class Memory implements StartStorage {
    private started: boolean = false;

    public getStarted(): boolean {
        return this.started;
    }

    public setStarted(started: boolean): void {
        this.started = started;
    }
}