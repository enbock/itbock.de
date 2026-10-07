import test from 'node:test';
import assert from 'node:assert/strict';
import SessionService from 'Core/Replication/SessionService';
import LocalStorage from 'Infrastructure/Replication/SessionStorage/LocalStorage/LocalStorage';

class InMemoryStorage implements Storage {
    private readonly data: Map<string, string> = new Map<string, string>();

    public get length(): number {
        return this.data.size;
    }

    public clear(): void {
        this.data.clear();
    }

    public getItem(key: string): string | null {
        return this.data.get(key) || null;
    }

    public key(index: number): string | null {
        const keys: Array<string> = Array.from(this.data.keys());
        return keys[index] || null;
    }

    public removeItem(key: string): void {
        this.data.delete(key);
    }

    public setItem(key: string, value: string): void {
        this.data.set(key, value);
    }
}

class ThrowingStorage implements Storage {
    public get length(): number {
        throw new Error('blocked');
    }

    public clear(): void {
        throw new Error('blocked');
    }

    public getItem(_key: string): string | null {
        throw new Error('blocked');
    }

    public key(_index: number): string | null {
        throw new Error('blocked');
    }

    public removeItem(_key: string): void {
        throw new Error('blocked');
    }

    public setItem(_key: string, _value: string): void {
        throw new Error('blocked');
    }
}

test('SessionService stores generated session ids in local storage', () => {
    const browserStorage: InMemoryStorage = new InMemoryStorage();
    const storage: LocalStorage = new LocalStorage(browserStorage);
    const sessionService: SessionService = new SessionService(
        () => '123e4567-e89b-42d3-a456-426614174000',
        storage
    );

    assert.equal(sessionService.getSessionId(), '123e4567-e89b-42d3-a456-426614174000');
    assert.equal(sessionService.getSessionId(), '123e4567-e89b-42d3-a456-426614174000');
    assert.equal(browserStorage.getItem('itbock.sessionId'), '123e4567-e89b-42d3-a456-426614174000');
});

test('LocalStorage falls back to memory when browser storage is blocked', () => {
    const storage: LocalStorage = new LocalStorage(new ThrowingStorage());
    const sessionService: SessionService = new SessionService(
        () => '123e4567-e89b-42d3-a456-426614174001',
        storage
    );

    assert.equal(sessionService.getSessionId(), '123e4567-e89b-42d3-a456-426614174001');
    assert.equal(sessionService.getSessionId(), '123e4567-e89b-42d3-a456-426614174001');
});
