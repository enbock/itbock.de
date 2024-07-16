import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import ParseHelper from 'Infrastructure/ParseHelper';
import Modules from 'Core/Start/Modules';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parseState(json: JsonData): StartReplicationEntity {
        const state: StartReplicationEntity = new StartReplicationEntity();
        state.module = this.parseHelper.get<Modules>(json, 'module', 'START_SCREEN');
        return state;
    }
}
