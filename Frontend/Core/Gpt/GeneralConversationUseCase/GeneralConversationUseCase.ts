import GptClient from 'Core/Gpt/GptClient';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import AudioService from 'Core/Audio/AudioService';
import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRequest from 'Core/Gpt/GeneralConversationUseCase/Request/ConversationRequest';
import ConversationResponse from 'Core/Gpt/GeneralConversationUseCase/ConversationResponse';
import StartConversationRequest from 'Core/Gpt/GeneralConversationUseCase/Request/StartConversationRequest';

export default class GeneralConversationUseCase {
    constructor(
        private gptClient: GptClient,
        private audioService: AudioService,
        private conversationStorage: ConversationStorage
    ) {
    }

    public async startConversation(request: StartConversationRequest): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        await this.executeConversation([]);
        this.changeToFinishedState();
    }

    public async runConversation(request: ConversationRequest, response: ConversationResponse): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        await this.applyConversation(request, response);
        this.changeToFinishedState();
    }

    private async applyConversation(request: ConversationRequest, response: ConversationResponse): Promise<void> {
        const conversations: Array<ConversationRecordEntity> = this.conversationStorage.getConversations();
        this.addConversationInput(request, conversations);
        await this.executeConversation(conversations, response);
    }

    private addConversationInput(request: ConversationRequest, conversations: Array<ConversationRecordEntity>): void {
        if (request.conversation == '') return;
        const record: ConversationRecordEntity = new ConversationRecordEntity();
        record.role = 'user';
        record.text = request.conversation;
        conversations.push(record);
    }

    private async executeConversation(conversations: Array<ConversationRecordEntity>, response?: ConversationResponse): Promise<void> {
        const record: ConversationRecordEntity = await this.gptClient.generalConversation(conversations);

        if (response) response.command = record.command;

        const gptText: string = record.text.trim();
        if (gptText == '') {
            this.audioService.continueWithoutText();
            return;
        }

        conversations.push(record);
        this.conversationStorage.setConversations(conversations);
        this.audioService.addAudioText(gptText);
    }

    private changeToLoadingState(onStateChange: Callback): void {
        this.conversationStorage.setLoading(true);
        void onStateChange();
    }

    private changeToFinishedState(): void {
        this.conversationStorage.setLoading(false);
    }
}
