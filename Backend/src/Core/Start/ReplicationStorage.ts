import StartReplicationEntity from './StartReplicationEntity';

export default interface ReplicationStorage {
    loadSessionData(sessionId: string): Promise<StartReplicationEntity>;

    saveSessionData(sessionId: string, data: StartReplicationEntity): Promise<void>;

    deleteSessionData(sessionId: string): Promise<void>;
}
