import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';

export default interface ReplicationCache {
    getState(): StartReplicationEntity;

    setState(startReplicationEntityPromise: StartReplicationEntity): void;
}
