import Modules from './Modules';
import StartReplicationConversationEntryEntity from './StartReplicationConversationEntryEntity';
import StartReplicationDocumentEntity from './StartReplicationDocumentEntity';

export default class StartReplicationEntity {
    public static readonly maxConversationEntries: number = 50;

    public persisted: boolean = false;
    public version: number = 0;
    public updatedAt: Date | null = null;
    public module: Modules = 'START_SCREEN';
    public language: string = 'de-DE';
    public busy: boolean = false;
    public busySince: Date | null = null;
    public conversations: Array<StartReplicationConversationEntryEntity> = [];
    public documents: Array<StartReplicationDocumentEntity> = [];

    public appendConversation(entry: StartReplicationConversationEntryEntity): void {
        this.conversations.push(entry);
        this.conversations = this.conversations.slice(-StartReplicationEntity.maxConversationEntries);
    }

    public setDocuments(documents: Array<StartReplicationDocumentEntity>): void {
        this.documents = [...documents];
    }

    public clearBusy(): void {
        this.busy = false;
        this.busySince = null;
    }

    public reset(language: string = this.language): void {
        this.module = 'START_SCREEN';
        this.language = language;
        this.conversations = [];
        this.documents = [];
        this.clearBusy();
    }
}
