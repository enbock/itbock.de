import ReplicationLoadResult from './ReplicationLoadResult';
import StartReplicationEntity from './StartReplicationEntity';

export default interface ReplicationStorage {
    loadSessionData(sessionId: string): Promise<ReplicationLoadResult>;

    saveSessionData(
        sessionId: string,
        data: StartReplicationEntity,
        revisionToken: string | null
    ): Promise<void>;

    deleteSessionData(sessionId: string): Promise<void>;
}
