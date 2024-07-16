import SessionStorage from 'Core/Replication/SessionStorage';

export default class Memory implements SessionStorage {
    private id: string = '';

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }
}
