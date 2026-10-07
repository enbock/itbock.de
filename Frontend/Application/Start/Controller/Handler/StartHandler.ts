import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import Adapter from 'Application/Start/Adapter';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';
import LeaderUseCase from 'Core/Replication/LeaderUseCase/LeaderUseCase';
import ReplicationPollHandler from 'Application/Start/Controller/Handler/ReplicationPollHandler';

export default class StartHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private startUseCase: StartUseCase,
        private inputUseCase: InputUseCase,
        private conversationUseCase: ConversationUseCase,
        private adapter: Adapter,
        private leaderUseCase: LeaderUseCase,
        private replicationPollHandler: ReplicationPollHandler
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.start = () => this.handleStart();
    }

    private async handleStart(): Promise<void> {
        this.startUseCase.startSession();
        this.replicationPollHandler.start();
        await this.leaderUseCase.start();
        await this.presentData();

        if (!this.leaderUseCase.isLeader()) return;

        await this.startUseCase.startApplication();
        this.inputUseCase.reset();
        void this.presentData();
        await this.conversationUseCase.startConversation({
            onStateChange: () => this.presentData()
        });
        const state: StartStateResponse = new StartStateResponse();
        this.startUseCase.getState(state);
        void this.presentData();
    }
}
