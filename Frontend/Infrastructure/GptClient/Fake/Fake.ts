import GptClient from 'Core/Gpt/GptClient';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';

export default class Fake implements GptClient {
    constructor(
        private cases: Array<FakeCase>
    ) {
    }

    public async generalConversation(conversations: Array<ConversationRecordEntity>): Promise<ConversationRecordEntity> {
        const result: ConversationRecordEntity = new ConversationRecordEntity();

        for (let fc of this.cases) {
            if (fc.support(conversations) == false) continue;
            fc.run(conversations, result);
            console.log('GPT-Emulation:', result);
            break;
        }

        return result;
    }

}
