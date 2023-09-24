import GptClient from 'Core/Gpt/GptClient';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import AudioService from 'Core/Audio/AudioService';
import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRequest from 'Core/Gpt/GeneralConversationUseCase/ConversationRequest';
import ConversationResponse from 'Core/Gpt/GeneralConversationUseCase/ConversationResponse';

export default class GeneralConversationUseCase {
    constructor(
        private gptClient: GptClient,
        private audioService: AudioService,
        private conversationStorage: ConversationStorage
    ) {
    }

    public async startConversation(): Promise<void> {
        await this.executeConversation([]);
    }

    public async runConversation(request: ConversationRequest, response: ConversationResponse): Promise<void> {
        const conversations: Array<ConversationRecordEntity> = this.conversationStorage.getConversations();
        this.addConversationInput(request, conversations);
        await this.executeConversation(conversations, response);
    }

    private async executeConversation(conversations: Array<ConversationRecordEntity>, response?: ConversationResponse): Promise<void> {
        const record: ConversationRecordEntity = await this.gptClient.generalConversation(conversations);

        if (response) response.command = record.command;

        const gptText: string = record.text.trim();
        if (gptText == '') return;

        conversations.push(record);
        this.conversationStorage.setConversations(conversations);
        this.audioService.addAudioText(gptText);
    }

    private addConversationInput(request: ConversationRequest, conversations: Array<ConversationRecordEntity>): void {
        if (request.conversation == '') return;
        const record: ConversationRecordEntity = new ConversationRecordEntity();
        record.role = 'user';
        record.text = request.conversation;
        conversations.push(record);
    }
}
