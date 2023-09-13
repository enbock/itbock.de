import StartStorage from 'Core/Start/StartStorage';

export default class Memory implements StartStorage {
    private started: boolean = false;
    private microphoneMuted: boolean = false;
    private showLinks: boolean = false;

    public getApplicationStarted(): boolean {
        return this.started;
    }

    public setApplicationStarted(started: boolean): void {
        this.started = started;
    }

    public getMicrophoneMuted(): boolean {
        return this.microphoneMuted;
    }

    public setMicrophoneMuted(muted: boolean): void {
        this.microphoneMuted = muted;
    }

    public getShowLinks(): boolean {
        return this.showLinks;
    }

    public setShowLinks(show: boolean): void {
        this.showLinks = show;
    }
}