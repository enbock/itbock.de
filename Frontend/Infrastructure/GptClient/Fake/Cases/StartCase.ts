import ConversationEntity from 'Core/Gpt/ConversationEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import FakeAudio from 'Infrastructure/GptClient/Fake/Cases/FakeAudio';

export default class StartCase implements FakeCase {
    public support(conversations: Array<ConversationEntity>): boolean {
        return conversations.length < 2;
    }

    public run(conversations: Array<ConversationEntity>, result: ConversationEntity): void {
        result.text = 'Willkommen';
        result.role = 'assistant';
        result.audio = FakeAudio;
    }
}
