import ReplicationCache from 'Core/Start/ReplicationCache';
import ReplicationClient from 'Core/Start/ReplicationClient';
import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import SessionService from 'Core/Replication/SessionService';

export default class ReplicationUseCase {
    constructor(
        public replicationCache: ReplicationCache,
        public replicationClient: ReplicationClient,
        public sessionService: SessionService
    ) {
    }

    public getState(): StartReplicationEntity {
        return this.replicationCache.getState();
    }

    public async pollState(): Promise<void> {
        this.replicationCache.setState(
            await this.replicationClient.loadState(
                this.sessionService.getSessionId()
            )
        );
    }
}
