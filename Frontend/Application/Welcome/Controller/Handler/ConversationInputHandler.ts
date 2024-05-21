import ControllerHandler from 'Application/ControllerHandler';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import ConversationResponse from 'Application/Welcome/Controller/Handler/ConversationResponse';
import CommandHandler from 'Application/Command/CommandHandler';
import ConversationRequest from 'Core/Gpt/GeneralConversationUseCase/Request/ConversationRequest';
import Channel from 'Core/Audio/InputUseCase/Channel';
import AudioInputReceiverHandler from 'Application/Audio/Controller/Handler/AudioInputReceiverHandler';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';

export default class ConversationInputHandler implements ControllerHandler, AudioInputReceiverHandler {
    constructor(
        private conversationUseCase: GeneralConversationUseCase,
        private commandHandler: Array<CommandHandler>,
        private audioControllerBus: AudioControllerBus,
        private startControllerBus: StartControllerBus
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
        const response: ConversationResponse = new ConversationResponse();
        const request: ConversationRequest = {
            conversation: text,
            onStateChange: () => this.presentAndRefresh()
        };
        await this.conversationUseCase.runConversation(request, response);
        response.commands.forEach(
            command => this.commandHandler.forEach(ch => ch.support(command) && ch.run())
        );
        await this.presentAndRefresh();
    }

    public async presentAndRefresh(): Promise<void> {
        await this.presentData();
        await this.audioControllerBus.refresh();
        await this.startControllerBus.refresh();
    }
}
