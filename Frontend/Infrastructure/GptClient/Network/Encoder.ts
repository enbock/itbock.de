import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class Encoder {
    public encodeConversations(conversations: Array<ConversationRecordEntity>): string {
        return JSON.stringify(
            {
                messages: conversations.map(x => this.encodeConversation(x))
            });
    }

    private encodeConversation(conversation: ConversationRecordEntity): Json {
        return {
            content: conversation.text,
            role: conversation.role
        };
    }
}
