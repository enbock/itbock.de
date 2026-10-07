import test from 'node:test';
import assert from 'node:assert/strict';
import SessionService from 'Core/Replication/SessionService';
import SessionStorage from 'Core/Replication/SessionStorage';
import ReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';
import ReplicationClient from 'Core/Start/ReplicationClient';
import ReplicationCache from 'Core/Start/ReplicationCache';
import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';

class FixedSessionStorage implements SessionStorage {
    constructor(
        private id: string
    ) {
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }
}

class FakeReplicationCache implements ReplicationCache {
    constructor(
        private state: StartReplicationEntity
    ) {
    }

    public getState(): StartReplicationEntity {
        return this.state;
    }

    public setState(startReplicationEntityPromise: StartReplicationEntity): void {
        this.state = startReplicationEntityPromise;
    }
}

class FakeReplicationClient implements ReplicationClient {
    public lastSessionId: string = '';
    public lastKnownVersion: number = -1;

    constructor(
        private nextState: StartReplicationEntity | null
    ) {
    }

    public async loadState(sessionId: string, knownVersion: number): Promise<StartReplicationEntity | null> {
        this.lastSessionId = sessionId;
        this.lastKnownVersion = knownVersion;

        return this.nextState;
    }
}

test('ReplicationUseCase keeps the cached state when replication is unchanged', async () => {
    const cachedState: StartReplicationEntity = new StartReplicationEntity();
    cachedState.version = 4;
    const client: FakeReplicationClient = new FakeReplicationClient(null);
    const useCase: ReplicationUseCase = new ReplicationUseCase(
        new FakeReplicationCache(cachedState),
        client,
        new SessionService(() => 'unused', new FixedSessionStorage('session-1'))
    );

    assert.equal(await useCase.pollState(), false);
    assert.equal(useCase.getState(), cachedState);
    assert.equal(client.lastSessionId, 'session-1');
    assert.equal(client.lastKnownVersion, 4);
});

test('ReplicationUseCase updates the cache when a newer replication version arrives', async () => {
    const cachedState: StartReplicationEntity = new StartReplicationEntity();
    cachedState.version = 1;
    const nextState: StartReplicationEntity = new StartReplicationEntity();
    nextState.version = 2;
    nextState.module = 'INFO';
    const useCase: ReplicationUseCase = new ReplicationUseCase(
        new FakeReplicationCache(cachedState),
        new FakeReplicationClient(nextState),
        new SessionService(() => 'unused', new FixedSessionStorage('session-1'))
    );

    assert.equal(await useCase.refresh(), true);
    assert.equal(useCase.getState(), nextState);
    assert.equal(useCase.getState().module, 'INFO');
});
