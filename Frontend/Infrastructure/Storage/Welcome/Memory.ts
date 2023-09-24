import StateStorage from 'Core/Welcome/StateStorage';

export default class Memory implements StateStorage {
    private showLinks: boolean = false;

    public getShowLinks(): boolean {
        return this.showLinks;
    }

    public setShowLinks(show: boolean): void {
        this.showLinks = show;
    }
}