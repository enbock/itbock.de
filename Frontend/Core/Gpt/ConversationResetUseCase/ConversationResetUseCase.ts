import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class ConversationResetUseCase {
    constructor(
        private conversationStorage: ConversationStorage
    ) {
    }

    public resetConversation(): void {
        const conversations: Array<ConversationRecordEntity> = this.conversationStorage.getConversations();
        const firstConversation: ConversationRecordEntity | undefined = conversations[0];
        if (firstConversation === undefined) return;

        this.conversationStorage.setConversations([firstConversation]);
    }
}
