export type Role = 'assistant' | 'user'

export default class ConversationRecordEntity {
    public role: Role = 'user';
    public text: string = '';
    public commands: Array<string> = [];
    public audio: string = '';
    public language: string = '';
}
