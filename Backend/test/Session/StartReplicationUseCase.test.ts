import assert from 'node:assert/strict';
import test from 'node:test';
import ReplicationConflictError from '../../src/Core/Start/ReplicationConflictError';
import ReplicationLoadResult from '../../src/Core/Start/ReplicationLoadResult';
import ReplicationStorage from '../../src/Core/Start/ReplicationStorage';
import SessionBusyError from '../../src/Core/Start/SessionBusyError';
import StartReplicationConversationEntryEntity from '../../src/Core/Start/StartReplicationConversationEntryEntity';
import StartReplicationEntity from '../../src/Core/Start/StartReplicationEntity';
import StartReplicationUseCase from '../../src/Core/Start/UseCase/StartReplicationUseCase';

class FakeReplicationStorage implements ReplicationStorage {
    public loadResults: Array<ReplicationLoadResult> = [];
    public saveCalls: Array<{
        sessionId: string;
        revisionToken: string | null;
        data: StartReplicationEntity;
    }> = [];
    public saveErrors: Array<Error> = [];

    public async loadSessionData(sessionId: string): Promise<ReplicationLoadResult> {
        const loadResult: ReplicationLoadResult | undefined = this.loadResults.shift();

        if (loadResult === undefined) {
            throw new Error(`Missing load result for ${sessionId}`);
        }

        return loadResult;
    }

    public async saveSessionData(
        sessionId: string,
        data: StartReplicationEntity,
        revisionToken: string | null
    ): Promise<void> {
        this.saveCalls.push({
            sessionId,
            revisionToken,
            data
        });

        const error: Error | undefined = this.saveErrors.shift();

        if (error !== undefined) {
            throw error;
        }
    }

    public async deleteSessionData(): Promise<void> {
    }
}

test('StartReplicationUseCase.updateSession retries after write conflicts', async (): Promise<void> => {
    const storage: FakeReplicationStorage = new FakeReplicationStorage();
    const useCase: StartReplicationUseCase = new StartReplicationUseCase(storage);
    const initialSession: StartReplicationEntity = new StartReplicationEntity();
    const reloadedSession: StartReplicationEntity = new StartReplicationEntity();

    reloadedSession.persisted = true;
    reloadedSession.version = 3;
    reloadedSession.appendConversation(
        new StartReplicationConversationEntryEntity('assistant', 'Vorherige Antwort', 'de-DE')
    );

    storage.loadResults.push(
        new ReplicationLoadResult(initialSession, null),
        new ReplicationLoadResult(reloadedSession, '"etag-2"')
    );
    storage.saveErrors.push(new ReplicationConflictError());

    const updatedSession: StartReplicationEntity = await useCase.updateSession(
        '550e8400-e29b-41d4-a716-446655440000',
        (sessionData: StartReplicationEntity): void => {
            sessionData.appendConversation(
                new StartReplicationConversationEntryEntity('user', 'Hallo', 'de-DE')
            );
        }
    );

    assert.equal(storage.saveCalls.length, 2);
    assert.equal(storage.saveCalls[0].revisionToken, null);
    assert.equal(storage.saveCalls[0].data.version, 1);
    assert.equal(storage.saveCalls[1].revisionToken, '"etag-2"');
    assert.equal(storage.saveCalls[1].data.version, 4);
    assert.equal(updatedSession.version, 4);
    assert.equal(updatedSession.persisted, true);
    assert.equal(updatedSession.conversations.length, 2);
    assert.equal(updatedSession.conversations[1].text, 'Hallo');
    assert.ok(updatedSession.updatedAt instanceof Date);
});

test('StartReplicationUseCase.startTurn rejects fresh busy sessions', async (): Promise<void> => {
    const storage: FakeReplicationStorage = new FakeReplicationStorage();
    const useCase: StartReplicationUseCase = new StartReplicationUseCase(storage);
    const busySession: StartReplicationEntity = new StartReplicationEntity();

    busySession.persisted = true;
    busySession.busy = true;
    busySession.busySince = new Date(Date.now() - 1_000);

    storage.loadResults.push(new ReplicationLoadResult(busySession, '"etag-1"'));

    await assert.rejects(
        async (): Promise<StartReplicationEntity> => await useCase.startTurn(
            '550e8400-e29b-41d4-a716-446655440000',
            new StartReplicationConversationEntryEntity('user', 'Hallo', 'de-DE')
        ),
        SessionBusyError
    );
    assert.equal(storage.saveCalls.length, 0);
});

test('StartReplicationUseCase.startTurn refreshes stale busy sessions', async (): Promise<void> => {
    const storage: FakeReplicationStorage = new FakeReplicationStorage();
    const useCase: StartReplicationUseCase = new StartReplicationUseCase(storage);
    const staleBusySession: StartReplicationEntity = new StartReplicationEntity();
    const staleBusySince: Date = new Date(Date.now() - 61_000);

    staleBusySession.persisted = true;
    staleBusySession.busy = true;
    staleBusySession.busySince = staleBusySince;

    storage.loadResults.push(new ReplicationLoadResult(staleBusySession, '"etag-1"'));

    const updatedSession: StartReplicationEntity = await useCase.startTurn(
        '550e8400-e29b-41d4-a716-446655440000',
        new StartReplicationConversationEntryEntity('user', 'Neue Anfrage', 'de-DE')
    );

    assert.equal(updatedSession.busy, true);
    assert.ok(updatedSession.busySince instanceof Date);
    assert.ok(updatedSession.busySince!.getTime() > staleBusySince.getTime());
    assert.equal(updatedSession.conversations.length, 1);
    assert.equal(updatedSession.conversations[0].text, 'Neue Anfrage');
    assert.equal(updatedSession.version, 1);
});
