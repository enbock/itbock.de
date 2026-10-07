import ConversationEntity from 'Core/Gpt/ConversationEntity';
import StartConversationRequest from 'Core/Gpt/ConversationUseCase/Request/StartConversationRequest';
import ConversationRequest from 'Core/Gpt/ConversationUseCase/Request/ConversationRequest';
import GptClient from 'Core/Gpt/GptClient';
import AudioService from 'Core/Audio/AudioService';
import StartStorage from 'Core/Start/StartStorage';
import StateResponse from 'Core/Gpt/ConversationUseCase/Response/StateResponse';
import ReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';

export default class ConversationUseCase {
    private isLoading: boolean = false;

    constructor(
        private gptClient: GptClient,
        private audioService: AudioService,
        private startStorage: StartStorage,
        private replicationUseCase: ReplicationUseCase,
        private inputUseCase: InputUseCase,
        private startUseCase: StartUseCase
    ) {
    }

    public getState(response: StateResponse): void {
        response.isLoading = this.isLoading;
    }

    public async startConversation(request: StartConversationRequest): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        try {
            const setupConversation: ConversationEntity = new ConversationEntity();
            setupConversation.language = this.getCurrentLanguage();
            setupConversation.role = 'assistant';
            await this.executeConversation(setupConversation);
        } finally {
            this.changeToFinishedState();
        }
    }

    public async runConversation(request: ConversationRequest): Promise<void> {
        this.changeToLoadingState(request.onStateChange);
        try {
            await this.applyConversation(request);
        } finally {
            this.changeToFinishedState();
        }
    }

    private async applyConversation(request: ConversationRequest): Promise<void> {
        if (request.conversation == '') {
            this.audioService.continueWithoutText();
            return;
        }
        const conversation: ConversationEntity = new ConversationEntity();
        conversation.role = 'user';
        conversation.text = request.conversation;
        conversation.language = this.getCurrentLanguage();
        await this.executeConversation(conversation);
    }

    private async executeConversation(conversation: ConversationEntity): Promise<void> {
        const record: ConversationEntity = await this.gptClient.generalConversation([conversation]);

        const gptText: string = record.text.trim();
        if (gptText == '') {
            this.audioService.continueWithoutText();
        } else {
            this.audioService.addAudioContent(gptText, record.audio);
        }

        if (record.language.trim() != '') this.startStorage.setLanguage(record.language);

        if (record.commands.includes('shutdown')) {
            this.inputUseCase.mute();
            await this.startUseCase.endSession();
        }

        await this.replicationUseCase.refresh();
    }

    private changeToLoadingState(onStateChange: Callback): void {
        this.isLoading = true;
        void onStateChange();
    }

    private changeToFinishedState(): void {
        this.isLoading = false;
    }

    private getCurrentLanguage(): string {
        const replicationLanguage: string = this.replicationUseCase.getState().language.trim();
        return replicationLanguage || this.startStorage.getLanguage();
    }
}
