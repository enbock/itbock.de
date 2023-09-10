import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default interface GptClient {
    generalConversation(): Promise<ConversationRecordEntity>;
}
