import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';

export default class StartCase implements FakeCase {
    public support(conversations: Array<ConversationRecordEntity>): boolean {
        return conversations.length == 0;
    }

    public run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void {
        result.text = 'Willkommen';
        result.role = 'assistant';
    }
}
