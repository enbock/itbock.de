import GptClient from 'Core/Gpt/GptClient';
import RunResponse from 'Core/Gpt/GeneralConversationUseCase/RunResponse';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import AudioService from 'Core/Audio/AudioService';

export default class GeneralConversationUseCase {
    constructor(
        private gptClient: GptClient,
        private audioService: AudioService
    ) {
    }

    public async runConversation(response: RunResponse): Promise<void> {
        const record: ConversationRecordEntity = await this.gptClient.generalConversation();
        response.conversation.conversations = [record];

        this.audioService.addAudioText(record.text);
    }
}
