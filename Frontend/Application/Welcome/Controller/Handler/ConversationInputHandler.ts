import ControllerHandler from 'Application/ControllerHandler';
import WelcomeBus from 'Application/Welcome/Controller/WelcomeBus';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import ConversationResponse from 'Application/Welcome/Controller/Handler/ConversationResponse';
import CommandHandler from 'Application/Welcome/Controller/Handler/Command/CommandHandler';
import ConversationRequest from 'Core/Gpt/GeneralConversationUseCase/Request/ConversationRequest';

export default class ConversationInputHandler implements ControllerHandler {
    constructor(
        private welcomeBus: WelcomeBus,
        private conversationUseCase: GeneralConversationUseCase,
        private commandHandler: Array<CommandHandler>
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.welcomeBus.newInput = (text: string) => this.handleInput(text);
    }

    private presentData: Callback = () => <never>false;

    private async handleInput(text: string): Promise<void> {
        const response: ConversationResponse = new ConversationResponse();
        const request: ConversationRequest = {
            conversation: text,
            onStateChange: () => this.presentData()
        };
        await this.conversationUseCase.runConversation(request, response);
        this.commandHandler.forEach(ch => ch.support(response.command) && ch.run());
        await this.presentData();
    }
}