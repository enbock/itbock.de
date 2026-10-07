export default class StartReplicationConversationEntryEntity {
    constructor(
        public role: string = 'assistant',
        public text: string = '',
        public language: string = 'de-DE'
    ) {
    }
}
