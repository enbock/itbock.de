import GptClient from 'Core/Gpt/GptClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ConversationEntity, {Command, Role} from 'Core/Gpt/ConversationEntity';
import Method from 'Infrastructure/ApiHelper/Method';
import ParseHelper from 'Infrastructure/ParseHelper';
import Encoder from 'Infrastructure/GptClient/Network/Encoder';

export default class Network implements GptClient {
    constructor(
        private fetchHelper: FetchHelper,
        private parseHelper: ParseHelper,
        private serviceUrl: string,
        private encoder: Encoder
    ) {
    }

    public async generalConversation(conversations: Array<ConversationEntity>): Promise<ConversationEntity> {
        const entity: ConversationEntity = new ConversationEntity();
        const response: Response = await fetch(
            this.serviceUrl,
            this.fetchHelper.createHeader(
                Method.POST,
                this.encoder.encodeConversations(conversations)
            )
        );

        this.fetchHelper.isResponseSuccessful(response);

        const data: Json = await response.json();

        entity.text = String(this.parseHelper.get<string>(data, 'say', 'Netzwerkfehler') || 'Datenfehler');
        entity.role = String(this.parseHelper.get<string>(data, 'role', 'user') || 'user') as Role;
        entity.commands = (this.parseHelper.get<Array<Command>>(data, 'commands', []) || []).map(s => <Command>String(s));
        entity.audio = String(this.parseHelper.get<string>(data, 'audio', '') || '');
        entity.language = String(this.parseHelper.get<string>(data, 'language', '') || 'de-DE');

        return entity;
    }
}
