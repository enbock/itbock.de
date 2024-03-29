import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';

export default class MuteMicrophone implements FakeCase {
    public support(conversations: Array<ConversationRecordEntity>): boolean {
        const lastUser: ConversationRecordEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && lastUser.text.toLocaleLowerCase().indexOf('stumm') > -1;
    }

    public run(conversations: Array<ConversationRecordEntity>, result: ConversationRecordEntity): void {
        result.text = 'Mikrofon wird ausgeschalten.';
        result.role = 'assistant';
        result.commands = ['mute'];
    }
}
