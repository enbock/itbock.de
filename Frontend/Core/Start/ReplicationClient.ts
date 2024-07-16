import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';

export default interface ReplicationClient {
    loadState(sessionId: string): Promise<StartReplicationEntity>;
}
