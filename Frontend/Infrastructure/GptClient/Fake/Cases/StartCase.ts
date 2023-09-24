import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class StartCase {
    public support(conversations: Array<ConversationRecordEntity>): boolean {
        return conversations.length == 0;
    }

    public run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void {
        result.text = 'Willkommen';
        result.role = 'assistant';
    }
}
