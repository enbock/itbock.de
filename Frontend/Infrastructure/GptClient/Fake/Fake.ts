import GptClient from 'Core/Gpt/GptClient';
import ConversationEntity from 'Core/Gpt/ConversationEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import sleep from 'Infrastructure/ApiHelper/sleep';

export default class Fake implements GptClient {
    constructor(
        private cases: Array<FakeCase>
    ) {
    }

    public async generalConversation(conversations: Array<ConversationEntity>): Promise<ConversationEntity> {
        const result: ConversationEntity = new ConversationEntity();
        result.role = 'assistant';
        console.log(
            '[GPT-Emulation] Start',
            conversations.length,
            conversations.length > 0 ? conversations[conversations.length - 1] : '<NONE>'
        );
        await sleep(1000);

        for (let fc of this.cases) {
            if (fc.support(conversations) == false) continue;
            fc.run(conversations, result);
            break;
        }

        console.log('[GPT-Emulation] End', result);
        return result;
    }
}
