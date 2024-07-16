import ParseHelper from '../../../../ParseHelper';
import StartReplicationEntity from '../../../../Core/Start/StartReplicationEntity';
import Modules from '../../../../Core/Start/Modules';

export default class ReplicationParser {
    constructor(private parseHelper: ParseHelper) {
    }

    public parseReplication(data: string): StartReplicationEntity {
        const replicationData: Json = JSON.parse(data);
        const entity: StartReplicationEntity = new StartReplicationEntity();

        entity.module = this.parseHelper.get<Modules>(replicationData, 'module', 'START_SCREEN');

        return entity;
    }
}
