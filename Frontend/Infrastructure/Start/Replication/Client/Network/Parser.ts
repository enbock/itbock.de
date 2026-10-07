import StartReplicationEntity, {
    StartReplicationConversationEntity,
    StartReplicationDocumentEntity
} from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import ParseHelper from 'Infrastructure/ParseHelper';
import Modules from 'Core/Start/Modules';
import {Role} from 'Core/Gpt/ConversationEntity';

export default class Parser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parseState(json: JsonData): StartReplicationEntity {
        const state: StartReplicationEntity = new StartReplicationEntity();
        state.version = this.parseVersion(this.parseHelper.get<unknown>(json, 'version', 0));
        state.module = this.parseModule(this.parseHelper.get<unknown>(json, 'module', 'START_SCREEN'));
        state.language = this.parseString(this.parseHelper.get<unknown>(json, 'language', ''));
        state.busy = this.parseHelper.get<boolean>(json, 'busy', false) === true;
        state.conversations = this.parseConversations(this.parseHelper.get<Array<JsonData>>(json, 'conversations', []));
        state.documents = this.parseDocuments(this.parseHelper.get<Array<JsonData>>(json, 'documents', []));

        return state;
    }

    private parseVersion(value: unknown): number {
        if (typeof value != 'number' || Number.isFinite(value) == false || value < 0) return 0;

        return value;
    }

    private parseModule(value: unknown): Modules {
        return value === 'CONVERSATION' || value === 'OLD_PAGE' || value === 'INFO'
            ? value
            : 'START_SCREEN'
            ;
    }

    private parseConversations(conversations: Array<JsonData>): Array<StartReplicationConversationEntity> {
        if (Array.isArray(conversations) == false) return [];

        return conversations.map((conversation: JsonData) => {
            const entity: StartReplicationConversationEntity = new StartReplicationConversationEntity();
            entity.role = this.parseRole(this.parseHelper.get<unknown>(conversation, 'role', 'assistant'));
            entity.text = this.parseString(this.parseHelper.get<unknown>(conversation, 'text', ''));
            entity.language = this.parseString(this.parseHelper.get<unknown>(conversation, 'language', ''));
            return entity;
        });
    }

    private parseDocuments(documents: Array<JsonData>): Array<StartReplicationDocumentEntity> {
        if (Array.isArray(documents) == false) return [];

        return documents.map((document: JsonData) => {
            const entity: StartReplicationDocumentEntity = new StartReplicationDocumentEntity();
            entity.id = this.parseString(this.parseHelper.get<unknown>(document, 'id', ''));
            entity.title = this.parseString(this.parseHelper.get<unknown>(document, 'title', ''));
            entity.text = this.parseString(this.parseHelper.get<unknown>(document, 'text', ''));
            entity.url = this.parseUrl(this.parseHelper.get<unknown>(document, 'url', null));
            return entity;
        });
    }

    private parseRole(value: unknown): Role {
        return value === 'user' || value === 'system'
            ? value
            : 'assistant'
            ;
    }

    private parseString(value: unknown): string {
        return typeof value == 'string' ? value : '';
    }

    private parseUrl(value: unknown): string | null {
        return typeof value == 'string' && value.trim() != '' ? value : null;
    }
}
