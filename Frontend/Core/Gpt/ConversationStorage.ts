import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default interface ConversationStorage {
    getConversations(): Array<ConversationEntity>;

    setConversations(conversations: Array<ConversationEntity>): void;

    setLoading(isLoading: boolean): void;

    getLoading(): boolean;
}
