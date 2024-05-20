import GptClient from 'Core/Gpt/GptClient';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import AudioService from 'Core/Audio/AudioService';
import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRequest from 'Core/Gpt/GeneralConversationUseCase/Request/ConversationRequest';
import ConversationResponse from 'Core/Gpt/GeneralConversationUseCase/ConversationResponse';
import StartConversationRequest from 'Core/Gpt/GeneralConversationUseCase/Request/StartConversationRequest';
import StartStorage from 'Core/Start/StartStorage';

export default class GeneralConversationUseCase {
    constructor(
        private gptClient: GptClient,
        private audioService: AudioService,
        private conversationStorage: ConversationStorage,
        private startStorage: StartStorage
    ) {
    }

    public async startConversation(request: StartConversationRequest): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        const setupConversation: ConversationRecordEntity = new ConversationRecordEntity();
        setupConversation.language = this.startStorage.getLanguage();
        setupConversation.role = 'assistant';
        await this.executeConversation([
            setupConversation
        ]);
        this.changeToFinishedState();
    }

    public async runConversation(request: ConversationRequest, response: ConversationResponse): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        await this.applyConversation(request, response);
        this.changeToFinishedState();
    }

    private async applyConversation(request: ConversationRequest, response: ConversationResponse): Promise<void> {
        const conversations: Array<ConversationRecordEntity> = this.conversationStorage.getConversations();
        const wasConversationAdded: boolean = this.addConversationInput(request, conversations);
        if (wasConversationAdded) await this.executeConversation(conversations, response);
        else this.changeToFinishedState();
    }

    private addConversationInput(request: ConversationRequest, conversations: Array<ConversationRecordEntity>): boolean {
        if (request.conversation == '') return false;

        const record: ConversationRecordEntity = new ConversationRecordEntity();
        record.role = 'user';
        record.text = request.conversation;
        record.language = this.startStorage.getLanguage();
        conversations.push(record);

        return true;
    }

    private async executeConversation(conversations: Array<ConversationRecordEntity>, response?: ConversationResponse): Promise<void> {
        const record: ConversationRecordEntity = await this.gptClient.generalConversation(conversations);

        if (response) response.commands = record.commands;

        const gptText: string = record.text.trim();
        if (gptText == '') {
            this.audioService.continueWithoutText();
            return;
        }

        this.startStorage.setLanguage(record.language);
        conversations.push(record);
        this.conversationStorage.setConversations(conversations);
        this.audioService.addAudioContent(gptText, record.audio);
    }

    private changeToLoadingState(onStateChange: Callback): void {
        this.conversationStorage.setLoading(true);
        void onStateChange();
    }

    private changeToFinishedState(): void {
        this.conversationStorage.setLoading(false);
    }
}
