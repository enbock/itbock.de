import StartReplicationEntity from '../StartReplicationEntity';
import ReplicationStorage from '../ReplicationStorage';

export default class StartReplicationUseCase {
    constructor(
        private startReplicationClient: ReplicationStorage
    ) {
    }

    public async loadSessionData(sessionId: string): Promise<StartReplicationEntity> {
        return await this.startReplicationClient.loadSessionData(sessionId);
    }
}
