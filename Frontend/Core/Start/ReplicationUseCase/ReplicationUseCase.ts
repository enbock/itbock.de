import ReplicationCache from 'Core/Start/ReplicationCache';
import ReplicationClient from 'Core/Start/ReplicationClient';
import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import SessionService from 'Core/Replication/SessionService';

export default class ReplicationUseCase {
    constructor(
        private replicationCache: ReplicationCache,
        private replicationClient: ReplicationClient,
        private sessionService: SessionService
    ) {
    }

    public getState(): StartReplicationEntity {
        return this.replicationCache.getState();
    }

    public async pollState(): Promise<boolean> {
        const currentState: StartReplicationEntity = this.replicationCache.getState();
        const state: StartReplicationEntity | null = await this.replicationClient.loadState(
            this.sessionService.getSessionId(),
            currentState.version
        );

        if (state === null || state.version == currentState.version) return false;

        this.replicationCache.setState(state);
        return true;
    }

    public async refresh(): Promise<boolean> {
        return this.pollState();
    }
}
