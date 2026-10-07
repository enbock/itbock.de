import ControllerHandler from 'Application/ControllerHandler';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import LeaderUseCase from 'Core/Replication/LeaderUseCase/LeaderUseCase';
import ReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';

export default class LeaderHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private leaderUseCase: LeaderUseCase,
        private inputUseCase: InputUseCase,
        private replicationUseCase: ReplicationUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.leaderUseCase.onChange((isLeader: boolean) => void this.handleLeaderChange(isLeader));
        await this.leaderUseCase.start();
    }

    private async handleLeaderChange(isLeader: boolean): Promise<void> {
        if (!isLeader) {
            this.inputUseCase.mute();
            await this.presentData();
            return;
        }

        if (this.replicationUseCase.getState().module == 'CONVERSATION') {
            this.inputUseCase.reset();
            this.inputUseCase.startInput();
        }

        await this.presentData();
    }
}
