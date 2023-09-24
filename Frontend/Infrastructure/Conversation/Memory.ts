import ConversationStorage from 'Core/Gpt/ConversationStorage';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class Memory implements ConversationStorage {
    private conversations: Array<ConversationRecordEntity> = [];
    private loading: boolean = false;

    public getConversations(): Array<ConversationRecordEntity> {
        return this.conversations;
    }

    public setConversations(conversations: Array<ConversationRecordEntity>): void {
        this.conversations = conversations;
    }

    public setLoading(isLoading: boolean): void {
        this.loading = isLoading;
    }

    public getLoading(): boolean {
        return this.loading;
    }
}