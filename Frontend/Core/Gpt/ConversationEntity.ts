export type Role = 'assistant' | 'user' | 'system';
export type Command = 'shutdown' | 'suspend' | 'openOldPage';

export default class ConversationEntity {
    public role: Role = 'user';
    public text: string = '';
    public commands: Array<Command> = [];
    public audio: string = '';
    public language: string = '';
    public data: Record<string, string> = {};
}
