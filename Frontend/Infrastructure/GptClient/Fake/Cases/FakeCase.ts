import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default interface FakeCase {
    support(conversations: Array<ConversationEntity>): boolean;

    run(conversations: Array<ConversationEntity>, result: ConversationEntity): void;
}
