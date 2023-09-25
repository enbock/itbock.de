import CommandHandler from 'Application/Command/CommandHandler';
import ConversationResetUseCase from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';

export default class SuspendCommand implements CommandHandler {
    constructor(
        private conversationResetUseCase: ConversationResetUseCase
    ) {
    }

    public support(command: string): boolean {
        return command == 'topicEnd';
    }

    public async run(): Promise<void> {
        this.conversationResetUseCase.resetConversation();
    }
}
