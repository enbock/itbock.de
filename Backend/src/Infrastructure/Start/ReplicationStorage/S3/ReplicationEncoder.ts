import StartReplicationEntity from '../../../../Core/Start/StartReplicationEntity';

export default class ReplicationEncoder {
    public encodeReplication(data: StartReplicationEntity): string {
        return JSON.stringify({
            module: data.module
        });
    }
}