import GptClient from 'Core/Gpt/GptClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ConversationEntity, {Command, Role} from 'Core/Gpt/ConversationEntity';
import Method from 'Infrastructure/ApiHelper/Method';
import ParseHelper from 'Infrastructure/ParseHelper';
import Encoder from 'Infrastructure/GptClient/Network/Encoder';
import SessionService from 'Core/Replication/SessionService';
import Modules from 'Core/Start/Modules';

export default class Network implements GptClient {
    constructor(
        private fetchHelper: FetchHelper,
        private parseHelper: ParseHelper,
        private serviceUrl: string,
        private encoder: Encoder,
        private sessionService: SessionService
    ) {
    }

    public async generalConversation(conversations: Array<ConversationEntity>): Promise<ConversationEntity> {
        const entity: ConversationEntity = new ConversationEntity();
        const response: Response = await fetch(
            this.serviceUrl,
            this.fetchHelper.createHeader(
                Method.POST,
                this.encoder.encodeConversations(conversations),
                {'session-id': this.sessionService.getSessionId()}
            )
        );

        this.fetchHelper.isResponseSuccessful(response);

        const data: JsonData = await response.json();

        entity.text = String(this.parseHelper.get<string>(data, 'say', 'Netzwerkfehler') || 'Datenfehler');
        entity.role = String(this.parseHelper.get<string>(data, 'role', 'user') || 'user') as Role;
        entity.commands = (this.parseHelper.get<Array<Command>>(data, 'commands', []) || [])
            .map(s => <Command>String(s))
        ;
        entity.audio = String(this.parseHelper.get<string>(data, 'audio', '') || '');
        entity.language = String(this.parseHelper.get<string>(data, 'language', '') || 'de-DE');
        entity.data = this.parseHelper.get<Record<string, string>>(data, 'data', {}) || {};
        entity.module = this.parseModule(this.parseHelper.get<unknown>(data, 'module', null));
        entity.version = this.parseVersion(this.parseHelper.get<unknown>(data, 'version', null));

        return entity;
    }

    private parseModule(value: unknown): Modules | null {
        return value === 'START_SCREEN' || value === 'CONVERSATION' || value === 'OLD_PAGE' || value === 'INFO'
            ? value
            : null
            ;
    }

    private parseVersion(value: unknown): number | null {
        if (typeof value != 'number' || Number.isFinite(value) == false || value < 0) return null;

        return value;
    }
}
