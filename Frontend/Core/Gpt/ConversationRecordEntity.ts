export type Role = '' | 'assistant' | 'user'

export default class ConversationRecordEntity {
    public role: Role = '';
    public text: string = '';
}