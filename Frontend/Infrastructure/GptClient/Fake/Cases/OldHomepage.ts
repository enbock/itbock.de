import ConversationEntity from 'Core/Gpt/ConversationEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import FakeAudio from 'Infrastructure/GptClient/Fake/Cases/FakeAudio';

export default class OldHomepage implements FakeCase {
    public support(conversations: Array<ConversationEntity>): boolean {
        const lastUser: ConversationEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && lastUser.text.toLocaleLowerCase().indexOf('homepage') > -1;
    }

    public run(conversations: Array<ConversationEntity>, result: ConversationEntity): void {
        result.text = 'Link zur alten Homepage wird angezeigt.';
        result.role = 'assistant';
        result.commands = ['openOldPage', 'suspend'];
        result.audio = FakeAudio;
    }
}
