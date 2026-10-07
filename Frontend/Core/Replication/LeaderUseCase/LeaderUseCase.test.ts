import test from 'node:test';
import assert from 'node:assert/strict';
import LeaderUseCase from 'Core/Replication/LeaderUseCase/LeaderUseCase';
import LeaderElection, {LeaderElectionChangeCallback} from 'Core/Replication/LeaderElection';

class FakeLeaderElection implements LeaderElection {
    public started: boolean = false;
    private leader: boolean = false;
    private callbacks: Array<LeaderElectionChangeCallback> = [];

    public async start(): Promise<void> {
        this.started = true;
    }

    public isLeader(): boolean {
        return this.leader;
    }

    public onChange(callback: LeaderElectionChangeCallback): void {
        this.callbacks.push(callback);
    }

    public changeLeader(isLeader: boolean): void {
        this.leader = isLeader;
        this.callbacks.forEach((callback: LeaderElectionChangeCallback) => callback(isLeader));
    }
}

test('LeaderUseCase exposes the current leader state and change notifications', async () => {
    const election: FakeLeaderElection = new FakeLeaderElection();
    const useCase: LeaderUseCase = new LeaderUseCase(election);
    const changes: Array<boolean> = [];

    useCase.onChange((isLeader: boolean) => changes.push(isLeader));

    await useCase.start();
    election.changeLeader(true);

    assert.equal(election.started, true);
    assert.equal(useCase.isLeader(), true);
    assert.deepEqual(changes, [true]);
});
