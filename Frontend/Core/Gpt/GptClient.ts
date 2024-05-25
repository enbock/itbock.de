import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default interface GptClient {
    generalConversation(conversations: Array<ConversationEntity>): Promise<ConversationEntity>;
}
