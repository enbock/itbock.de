import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class EndOfTopicCase implements FakeCase {
    public support(conversations: Array<ConversationRecordEntity>): boolean {
        const lastUser: ConversationRecordEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && (
            lastUser.text.toLocaleLowerCase().indexOf('standby') > -1 ||
            lastUser.text.toLocaleLowerCase().indexOf('inaktiv') > -1
        );
    }

    public run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void {
        result.text = '';
        result.role = 'assistant';
        result.commands = ['topicEnd'];
    }
}
