import test from 'node:test';
import assert from 'node:assert/strict';
import WebLocks from 'Infrastructure/Replication/LeaderElection/WebLocks';

type LockCallback = (lock: Lock | null) => Promise<void>;

interface QueuedRequest {
    callback: LockCallback;
    resolveStart: () => void;
}

class FakeLockManager {
    private activeCallback?: LockCallback;
    private queue: Array<QueuedRequest> = [];

    public async request(
        _name: string,
        options: LockOptions & {ifAvailable?: boolean},
        callback: LockCallback
    ): Promise<void> {
        if (!this.activeCallback) {
            this.activeCallback = callback;
            await callback(this.createLock());
            return;
        }

        if (options.ifAvailable == true) {
            await callback(null);
            return;
        }

        await new Promise<void>((resolve) => {
            this.queue.push({
                callback,
                resolveStart: resolve
            });
        });
    }

    public async release(): Promise<void> {
        const nextRequest: QueuedRequest | undefined = this.queue.shift();
        if (!nextRequest) {
            this.activeCallback = undefined;
            return;
        }

        this.activeCallback = nextRequest.callback;
        nextRequest.resolveStart();
        void nextRequest.callback(this.createLock());
        await Promise.resolve();
    }

    private createLock(): Lock {
        return {
            name: 'itbock.microphone',
            mode: 'exclusive'
        } as Lock;
    }
}

test('WebLocks elects the first tab and promotes the next waiting tab after release', async () => {
    const lockManager: FakeLockManager = new FakeLockManager();
    const first: WebLocks = new WebLocks(lockManager as unknown as LockManager);
    const second: WebLocks = new WebLocks(lockManager as unknown as LockManager);
    const firstChanges: Array<boolean> = [];
    const secondChanges: Array<boolean> = [];

    first.onChange((isLeader: boolean) => firstChanges.push(isLeader));
    second.onChange((isLeader: boolean) => secondChanges.push(isLeader));

    await first.start();
    await second.start();

    assert.equal(first.isLeader(), true);
    assert.equal(second.isLeader(), false);

    await lockManager.release();

    assert.equal(second.isLeader(), true);
    assert.deepEqual(firstChanges, [true]);
    assert.deepEqual(secondChanges, [true]);
});

test('WebLocks degrades to leader mode when browser locks are unavailable', async () => {
    const election: WebLocks = new WebLocks();

    await election.start();

    assert.equal(election.isLeader(), true);
});
