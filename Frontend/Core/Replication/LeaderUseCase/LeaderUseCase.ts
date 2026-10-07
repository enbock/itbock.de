import LeaderElection, {LeaderElectionChangeCallback} from 'Core/Replication/LeaderElection';

export default class LeaderUseCase {
    constructor(
        private leaderElection: LeaderElection
    ) {
    }

    public async start(): Promise<void> {
        await this.leaderElection.start();
    }

    public isLeader(): boolean {
        return this.leaderElection.isLeader();
    }

    public onChange(callback: LeaderElectionChangeCallback): void {
        this.leaderElection.onChange(callback);
    }
}
