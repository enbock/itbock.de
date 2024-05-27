import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationEntity, {Command} from 'Core/Gpt/ConversationEntity';
import StartConversationRequest from 'Core/Gpt/ConversationUseCase/Request/StartConversationRequest';
import ConversationRequest from 'Core/Gpt/ConversationUseCase/Request/ConversationRequest';
import GptClient from 'Core/Gpt/GptClient';
import AudioService from 'Core/Audio/AudioService';
import StartStorage from 'Core/Start/StartStorage';
import StateResponse from 'Core/Gpt/ConversationUseCase/Response/StateResponse';
import Modules from 'Core/Start/Modules';
import AudioFeedbackClient, {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';

export default class ConversationUseCase {
    constructor(
        private conversationStorage: ConversationStorage,
        private gptClient: GptClient,
        private audioService: AudioService,
        private startStorage: StartStorage,
        private audioFeedbackClient: AudioFeedbackClient
    ) {
    }

    public getState(response: StateResponse): void {
        response.isLoading = this.conversationStorage.getLoading();
        response.conversations = this.conversationStorage.getConversations();
    }

    public resetConversation(): void {
        const conversations: Array<ConversationEntity> = this.conversationStorage.getConversations();
        const firstConversation: ConversationEntity | undefined = conversations[0];
        if (firstConversation === undefined) return;

        this.conversationStorage.setConversations([firstConversation]);
    }

    public async startConversation(request: StartConversationRequest): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        const setupConversation: ConversationEntity = new ConversationEntity();
        setupConversation.language = this.startStorage.getLanguage();
        setupConversation.role = 'assistant';
        await this.executeConversation([
            setupConversation
        ]);
        this.changeToFinishedState();
    }

    public async runConversation(request: ConversationRequest): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        await this.applyConversation(request);
        this.changeToFinishedState();
    }

    private async applyConversation(request: ConversationRequest): Promise<void> {
        const conversations: Array<ConversationEntity> = this.conversationStorage.getConversations();
        const wasConversationAdded: boolean = this.addConversationInput(request, conversations);
        if (wasConversationAdded) await this.executeConversation(conversations);
        else this.audioService.continueWithoutText();
    }

    private addConversationInput(request: ConversationRequest, conversations: Array<ConversationEntity>): boolean {
        if (request.conversation == '') return false;

        const record: ConversationEntity = new ConversationEntity();
        record.role = 'user';
        record.text = request.conversation;
        record.language = this.startStorage.getLanguage();
        conversations.push(record);

        return true;
    }

    private async executeConversation(conversations: Array<ConversationEntity>): Promise<void> {
        const record: ConversationEntity = await this.gptClient.generalConversation(conversations);

        await this.handleCommands(record.commands);

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

    private async handleCommands(commands: Array<Command>): Promise<void> {
        if (commands.includes('openOldPage')) this.startStorage.setModuleName(Modules.OLD_PAGE);
        if (commands.includes('mute')) await this.switchToStartScreen();
        if (commands.includes('topicEnd')) this.audioService.suspend();
    }

    private async switchToStartScreen(): Promise<void> {
        this.startStorage.setModuleName(Modules.START_SCREEN);
        void this.audioFeedbackClient.play(FEEDBACK.SCREEN_OFF);
    }
}
