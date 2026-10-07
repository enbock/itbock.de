import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';

export default interface ReplicationClient {
    loadState(sessionId: string, knownVersion: number): Promise<StartReplicationEntity | null>;
}
