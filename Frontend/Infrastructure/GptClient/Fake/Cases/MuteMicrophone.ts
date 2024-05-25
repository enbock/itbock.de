import ConversationEntity from 'Core/Gpt/ConversationEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import FakeAudio from 'Infrastructure/GptClient/Fake/Cases/FakeAudio';

export default class MuteMicrophone implements FakeCase {
    public support(conversations: Array<ConversationEntity>): boolean {
        const lastUser: ConversationEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && lastUser.text.toLocaleLowerCase().indexOf('stumm') > -1;
    }

    public run(conversations: Array<ConversationEntity>, result: ConversationEntity): void {
        result.text = 'Mikrofon wird ausgeschalten.';
        result.role = 'assistant';
        result.commands = ['mute'];
        result.audio = FakeAudio;
    }
}
