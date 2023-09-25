import GptClient from 'Core/Gpt/GptClient';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import sleep from 'Infrastructure/ApiHelper/sleep';

export default class Fake implements GptClient {
    constructor(
        private cases: Array<FakeCase>
    ) {
    }

    public async generalConversation(conversations: Array<ConversationRecordEntity>): Promise<ConversationRecordEntity> {
        const result: ConversationRecordEntity = new ConversationRecordEntity();
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
