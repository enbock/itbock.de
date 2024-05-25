import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import ConversationEntity from 'Core/Gpt/ConversationEntity';
import FakeAudio from 'Infrastructure/GptClient/Fake/Cases/FakeAudio';

export default class EndOfTopicCase implements FakeCase {
    public support(conversations: Array<ConversationEntity>): boolean {
        const lastUser: ConversationEntity | undefined = conversations.findLast(x => x.role == 'user');
        return lastUser !== undefined && (
            lastUser.text.toLocaleLowerCase().indexOf('standby') > -1 ||
            lastUser.text.toLocaleLowerCase().indexOf('inaktiv') > -1
        );
    }

    public run(conversations: Array<ConversationEntity>, result: ConversationEntity): void {
        result.text = 'Computer geht aus';
        result.role = 'assistant';
        result.commands = ['topicEnd'];
        result.audio = FakeAudio;
    }
}
