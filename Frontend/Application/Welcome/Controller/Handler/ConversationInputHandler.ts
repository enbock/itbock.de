import ControllerHandler from 'Application/ControllerHandler';
import WelcomeBus from 'Application/Welcome/Controller/WelcomeBus';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';

export default class ConversationInputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private welcomeBus: WelcomeBus,
        private conversationUseCase: GeneralConversationUseCase
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.welcomeBus.newInput = (text: string) => this.handleInput(text);
    }

    private async handleInput(text: string): Promise<void> {
        await this.conversationUseCase.runConversation({conversation: text});
        await this.presentData();
    }
}
