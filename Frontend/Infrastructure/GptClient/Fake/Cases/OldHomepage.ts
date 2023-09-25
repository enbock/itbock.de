import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';

export default class OldHomepage implements FakeCase {
    public support(conversations: Array<ConversationRecordEntity>): boolean {
        const lastUser: ConversationRecordEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && lastUser.text.toLocaleLowerCase().indexOf('homepage') > -1;
    }

    public run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void {
        result.text = 'Link zur alten Homepage wird angezeigt.';
        result.role = 'assistant';
        result.commands = ['openOldPage', 'topicEnd'];
    }
}
