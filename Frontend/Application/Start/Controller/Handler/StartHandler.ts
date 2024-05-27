import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import Adapter from 'Application/Start/Adapter';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';

export default class StartHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private startUseCase: StartUseCase,
        private inputUseCase: InputUseCase,
        private conversationUseCase: ConversationUseCase,
        private adapter: Adapter
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.start = () => this.handleStart();
    }

    private async handleStart(): Promise<void> {
        await this.startUseCase.startApplication();
        this.inputUseCase.restart();
        void this.presentData();
        await this.conversationUseCase.startConversation({
            onStateChange: () => this.presentData()
        });
        const state: StartStateResponse = new StartStateResponse();
        this.startUseCase.getState(state);
        this.inputUseCase.updateByModule({module: state.module});
        void this.presentData();
    }
}
