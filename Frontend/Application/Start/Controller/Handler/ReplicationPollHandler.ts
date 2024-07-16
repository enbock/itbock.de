import ControllerHandler from 'Application/ControllerHandler';
import TimeHelper, {TimeHandler} from 'Application/Start/TimeHelper/TimeHelper';
import ReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';

export default class ReplicationPollHandler implements ControllerHandler {
    private handler: TimeHandler;
    private presentData: Callback = () => <never>false;

    constructor(
        timeHelper: TimeHelper,
        private replicationUseCase: ReplicationUseCase,
        pollTime: number
    ) {
        this.handler = timeHelper.register(this.pollData.bind(this), pollTime);
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.handler.start();
        this.presentData = presentData;
    }

    private async pollData(): Promise<void> {
        await this.replicationUseCase.pollState();
        void this.presentData();
        this.handler.start();
    }
}
