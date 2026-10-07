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
        this.presentData = presentData;
    }

    public start(): void {
        this.handler.start();
    }

    private async pollData(): Promise<void> {
        const hasChanged: boolean = await this.replicationUseCase.pollState();
        if (hasChanged) void this.presentData();
        this.handler.start();
    }
}
