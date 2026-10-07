import ParseHelper from '../../../../ParseHelper';
import {isStartReplicationModule} from '../../../../Core/Start/Modules';
import StartReplicationEntity from '../../../../Core/Start/StartReplicationEntity';
import StartReplicationConversationEntryEntity from '../../../../Core/Start/StartReplicationConversationEntryEntity';
import StartReplicationDocumentEntity from '../../../../Core/Start/StartReplicationDocumentEntity';

export default class ReplicationParser {
    constructor(private parseHelper: ParseHelper) {
    }

    public parseReplication(data: string): StartReplicationEntity {
        const entity: StartReplicationEntity = new StartReplicationEntity();
        const replicationData: Json = this.parseJson(data);

        entity.version = this.parseVersion(this.parseHelper.get<unknown>(replicationData, 'version', 0));
        entity.updatedAt = this.parseDate(this.parseHelper.get<unknown>(replicationData, 'updatedAt', null));
        entity.module = this.parseModule(this.parseHelper.get<unknown>(replicationData, 'module', 'START_SCREEN'));
        entity.language = this.parseLanguage(this.parseHelper.get<unknown>(replicationData, 'language', 'de-DE'));
        entity.busy = this.parseBoolean(this.parseHelper.get<unknown>(replicationData, 'busy', false));
        entity.busySince = this.parseDate(this.parseHelper.get<unknown>(replicationData, 'busySince', null));
        entity.conversations = this.parseConversations(
            this.parseHelper.get<unknown>(replicationData, 'conversations', [])
        );
        entity.documents = this.parseDocuments(
            this.parseHelper.get<unknown>(replicationData, 'documents', [])
        );

        return entity;
    }

    private parseJson(data: string): Json {
        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    }

    private parseVersion(value: unknown): number {
        return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0;
    }

    private parseModule(value: unknown): StartReplicationEntity['module'] {
        return isStartReplicationModule(value) ? value : 'START_SCREEN';
    }

    private parseLanguage(value: unknown): string {
        return typeof value === 'string' && value.trim() ? value : 'de-DE';
    }

    private parseBoolean(value: unknown): boolean {
        return typeof value === 'boolean' ? value : false;
    }

    private parseDate(value: unknown): Date | null {
        if (typeof value !== 'string' || !value.trim()) {
            return null;
        }

        const parsedDate: Date = new Date(value);

        return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    private parseConversations(value: unknown): Array<StartReplicationConversationEntryEntity> {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map(
                (entry: unknown): StartReplicationConversationEntryEntity | null => {
                    if (!entry || typeof entry !== 'object') {
                        return null;
                    }

                    const role: unknown = this.parseHelper.get<unknown>(entry, 'role', '');
                    const text: unknown = this.parseHelper.get<unknown>(entry, 'text', '');
                    const language: unknown = this.parseHelper.get<unknown>(entry, 'language', 'de-DE');

                    if (typeof role !== 'string' || typeof text !== 'string' || typeof language !== 'string') {
                        return null;
                    }

                    return new StartReplicationConversationEntryEntity(role, text, language);
                }
            )
            .filter(
                (
                    entry: StartReplicationConversationEntryEntity | null
                ): entry is StartReplicationConversationEntryEntity => entry !== null
            )
            .slice(-StartReplicationEntity.maxConversationEntries);
    }

    private parseDocuments(value: unknown): Array<StartReplicationDocumentEntity> {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map(
                (document: unknown): StartReplicationDocumentEntity | null => {
                    if (!document || typeof document !== 'object') {
                        return null;
                    }

                    const id: unknown = this.parseHelper.get<unknown>(document, 'id', '');
                    const title: unknown = this.parseHelper.get<unknown>(document, 'title', '');
                    const text: unknown = this.parseHelper.get<unknown>(document, 'text', '');
                    const url: unknown = this.parseHelper.get<unknown>(document, 'url', null);

                    if (typeof id !== 'string' || typeof title !== 'string' || typeof text !== 'string') {
                        return null;
                    }

                    if (url !== null && typeof url !== 'string') {
                        return null;
                    }

                    return new StartReplicationDocumentEntity(id, title, text, url);
                }
            )
            .filter(
                (document: StartReplicationDocumentEntity | null): document is StartReplicationDocumentEntity =>
                    document !== null
            );
    }
}
