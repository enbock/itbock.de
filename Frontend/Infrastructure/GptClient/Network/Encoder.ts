import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default class Encoder {
    public encodeConversations(conversations: Array<ConversationEntity>): string {
        return JSON.stringify(
            {
                messages: conversations.map(x => this.encodeConversation(x))
            });
    }

    private encodeConversation(conversation: ConversationEntity): Json {
        return {
            content: conversation.text,
            role: conversation.role,
            language: conversation.language
        };
    }
}
