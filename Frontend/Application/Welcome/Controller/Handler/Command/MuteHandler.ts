import CommandHandler from 'Application/Command/CommandHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import ConversationResetUseCase from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';

export default class MuteHandler implements CommandHandler {
    constructor(
        private audioInputUseCase: AudioInputUseCase,
        private audioControllerBus: AudioControllerBus,
        private conversationResetUseCase: ConversationResetUseCase
    ) {
    }

    public async run(): Promise<void> {
        this.conversationResetUseCase.resetConversation();
        this.audioInputUseCase.mute();
        await this.audioControllerBus.refresh();
    }

    public support(command: string): boolean {
        return command == 'mute';
    }
}
