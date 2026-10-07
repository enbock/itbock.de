import StartReplicationEntity from './StartReplicationEntity';

export default class ReplicationLoadResult {
    constructor(
        public session: StartReplicationEntity = new StartReplicationEntity(),
        public revisionToken: string | null = null
    ) {
    }
}
