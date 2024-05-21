import CommandHandler from 'Application/Command/CommandHandler';
import ConversationResetUseCase from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';

export default class MuteHandler implements CommandHandler {
    constructor(
        private conversationResetUseCase: ConversationResetUseCase,
        private startUseCase: StartUseCase
    ) {
    }

    public async run(): Promise<void> {
        this.conversationResetUseCase.resetConversation();
        this.startUseCase.initialize(navigator.language);
    }

    public support(command: string): boolean {
        return command == 'mute';
    }
}
