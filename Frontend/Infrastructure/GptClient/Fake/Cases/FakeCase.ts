import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default interface FakeCase {
    support(conversations: Array<ConversationRecordEntity>): boolean;

    run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void;
}
