import ControllerHandler from 'Application/ControllerHandler';
import ConversationRequest from 'Core/Gpt/ConversationUseCase/Request/ConversationRequest';
import Channel from 'Core/Audio/InputUseCase/Channel';
import AudioInputReceiverHandler from 'Application/Start/Controller/Handler/AudioInputReceiverHandler';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class ConversationInputHandler implements ControllerHandler, AudioInputReceiverHandler {
    constructor(
        private conversationUseCase: ConversationUseCase,
        private startUseCase: StartUseCase,
        private inputUseCase: InputUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
    }

    public support(channel: Channel): boolean {
        return channel == Channel.DEFAULT;
    }

    public async receiveText(text: string): Promise<void> {
        await this.handleInput(text);
    }

    private presentData: Callback = () => <never>false;

    private async handleInput(text: string): Promise<void> {
        const request: ConversationRequest = {
            conversation: text,
            onStateChange: () => this.presentData()
        };
        await this.conversationUseCase.runConversation(request);

        const state: StartStateResponse = new StartStateResponse();
        this.startUseCase.getState(state);
        this.inputUseCase.updateByModule({module: state.module});

        void this.presentData();
    }
}
