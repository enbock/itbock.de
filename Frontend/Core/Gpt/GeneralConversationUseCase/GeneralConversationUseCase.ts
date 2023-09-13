import GptClient from 'Core/Gpt/GptClient';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import AudioService from 'Core/Audio/AudioService';
import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRequest from 'Core/Gpt/GeneralConversationUseCase/ConversationRequest';
import AudioStorage from 'Core/Audio/AudioStorage';
import StartStorage from 'Core/Start/StartStorage';

export default class GeneralConversationUseCase {
    constructor(
        private gptClient: GptClient,
        private audioService: AudioService,
        private conversationStorage: ConversationStorage,
        private audioStorage: AudioStorage,
        private startStorage: StartStorage
    ) {
    }

    public async runConversation(request: ConversationRequest): Promise<void> {
        // TODO: Ladestatus einbauen
        this.audioStorage.setPlaying(true);

        const conversations: Array<ConversationRecordEntity> = this.conversationStorage.getConversations();
        this.addConversationInput(request, conversations);
        const record: ConversationRecordEntity = await this.gptClient.generalConversation(conversations);

        // TODO: Setup und verteilung von befehlen
        if (record.command == 'mute') this.startStorage.setMicrophoneMuted(true);
        if (record.command == 'openOldPage') this.startStorage.setShowLinks(true);

        this.audioService.addAudioText(record.text);
        conversations.push(record);
        this.conversationStorage.setConversations(conversations);
    }

    private addConversationInput(request: ConversationRequest, conversations: Array<ConversationRecordEntity>): void {
        if (request.conversation == '') return;
        const record: ConversationRecordEntity = new ConversationRecordEntity();
        record.role = 'user';
        record.text = request.conversation;
        conversations.push(record);
    }
}
