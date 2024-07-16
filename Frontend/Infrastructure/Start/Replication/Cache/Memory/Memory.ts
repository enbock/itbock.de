import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import ReplicationCache from 'Core/Start/ReplicationCache';

export default class Memory implements ReplicationCache {
    private state: StartReplicationEntity = new StartReplicationEntity();

    public getState(): StartReplicationEntity {
        return this.state;
    }

    public async setState(startReplicationEntityPromise: StartReplicationEntity): Promise<void> {
        this.state = startReplicationEntityPromise;
    }
}
