import ControllerHandler from 'Application/ControllerHandler';
import ConversationRequest from 'Core/Gpt/ConversationUseCase/Request/ConversationRequest';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import StartBus from 'Application/Start/StartBus';

export default class ConversationInputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private conversationUseCase: ConversationUseCase,
        private startBus: StartBus
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.startBus.receiveText = this.receiveText.bind(this);
    }

    private async receiveText(text: string): Promise<void> {
        const request: ConversationRequest = {
            conversation: text,
            onStateChange: () => this.presentData()
        };
        await this.conversationUseCase.runConversation(request);

        void this.presentData();
    }
}
