export type Role = 'assistant' | 'user'

export default class ConversationRecordEntity {
    public role: Role = 'user';
    public text: string = '';
    public command: string = '';
}