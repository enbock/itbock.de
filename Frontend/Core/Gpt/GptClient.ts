import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default interface GptClient {
    generalConversation(conversations: Array<ConversationRecordEntity>): Promise<ConversationRecordEntity>;
}
