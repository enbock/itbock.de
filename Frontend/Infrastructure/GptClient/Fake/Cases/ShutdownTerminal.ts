import ConversationEntity from 'Core/Gpt/ConversationEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import FakeAudio from 'Infrastructure/GptClient/Fake/Cases/FakeAudio';

export default class ShutdownTerminal implements FakeCase {
    public support(conversations: Array<ConversationEntity>): boolean {
        const lastUser: ConversationEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && lastUser.text.toLocaleLowerCase().indexOf('computer aus') > -1;
    }

    public run(conversations: Array<ConversationEntity>, result: ConversationEntity): void {
        result.text = 'Terminal wird ausgeschalten.';
        result.role = 'assistant';
        result.commands = ['shutdown'];
        result.audio = FakeAudio;
    }
}
