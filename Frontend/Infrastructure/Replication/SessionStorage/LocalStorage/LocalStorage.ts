import SessionStorage from 'Core/Replication/SessionStorage';

export default class LocalStorage implements SessionStorage {
    private memoryId: string = '';

    constructor(
        private storage: Storage
    ) {
    }

    public getId(): string {
        try {
            return this.storage.getItem('itbock.sessionId') || this.memoryId;
        } catch {
            return this.memoryId;
        }
    }

    public setId(id: string): void {
        this.memoryId = id;

        try {
            this.storage.setItem('itbock.sessionId', id);
        } catch {
        }
    }
}
