import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default interface ConversationStorage {
    getConversations(): Array<ConversationRecordEntity>;

    setConversations(conversations: Array<ConversationRecordEntity>): void;
}
