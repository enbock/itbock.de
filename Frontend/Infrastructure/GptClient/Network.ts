import GptClient from 'Core/Gpt/GptClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';
import Method from 'Infrastructure/ApiHelper/Method';
import ParseHelper from 'Infrastructure/ParseHelper';

export default class Network implements GptClient {
    constructor(
        private fetchHelper: FetchHelper,
        private parseHelper: ParseHelper,
        private serviceUrl: string
    ) {
    }

    public async generalConversation(): Promise<ConversationRecordEntity> {
        const entity: ConversationRecordEntity = new ConversationRecordEntity();
        const response: Response = await fetch(this.serviceUrl, this.fetchHelper.createHeader(Method.POST, JSON.stringify({})));

        this.fetchHelper.isResponseSuccessful(response);

        entity.text = this.parseHelper.get<string>(await response.json(), 'say', 'Netzwerkfehler') || 'Datenfehler';
        return entity;
    }
}
