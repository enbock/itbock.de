import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default class Memory implements ConversationStorage {
    private conversations: Array<ConversationEntity> = [];
    private loading: boolean = false;

    public getConversations(): Array<ConversationEntity> {
        return this.conversations;
    }

    public setConversations(conversations: Array<ConversationEntity>): void {
        this.conversations = conversations;
    }

    public setLoading(isLoading: boolean): void {
        this.loading = isLoading;
    }

    public getLoading(): boolean {
        return this.loading;
    }
}
