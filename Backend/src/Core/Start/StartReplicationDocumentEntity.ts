export default class StartReplicationDocumentEntity {
    constructor(
        public id: string = '',
        public title: string = '',
        public text: string = '',
        public url: string | null = null
    ) {
    }
}
