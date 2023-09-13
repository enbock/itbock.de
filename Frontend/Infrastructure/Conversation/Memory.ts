import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class Memory implements ConversationStorage {
    private conversations: Array<ConversationRecordEntity> = [];

    public getConversations(): Array<ConversationRecordEntity> {
        return this.conversations;
    }

    public setConversations(conversations: Array<ConversationRecordEntity>): void {
        this.conversations = conversations;
    }
}