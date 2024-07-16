import StartReplicationEntity from '../../../Core/Start/StartReplicationEntity';

export interface StartReplicationModel {
    module: string;
}

export default class StartReplicationPresenter {
    public present(data: StartReplicationEntity): StartReplicationModel {
        return {
            module: data.module
        };
    }
}
