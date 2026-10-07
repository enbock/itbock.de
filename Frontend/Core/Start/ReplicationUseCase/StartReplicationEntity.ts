import Modules from 'Core/Start/Modules';
import {Role} from 'Core/Gpt/ConversationEntity';

export class StartReplicationConversationEntity {
    public role: Role = 'assistant';
    public text: string = '';
    public language: string = '';
}

export class StartReplicationDocumentEntity {
    public id: string = '';
    public title: string = '';
    public text: string = '';
    public url: string | null = null;
}

export default class StartReplicationEntity {
    public version: number = 0;
    public module: Modules = 'START_SCREEN';
    public language: string = '';
    public busy: boolean = false;
    public conversations: Array<StartReplicationConversationEntity> = [];
    public documents: Array<StartReplicationDocumentEntity> = [];
}
