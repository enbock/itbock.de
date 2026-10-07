import StartReplicationEntity from '../../../../Core/Start/StartReplicationEntity';

export default class ReplicationEncoder {
    public encodeReplication(data: StartReplicationEntity): string {
        return JSON.stringify({
            version: data.version,
            updatedAt: data.updatedAt?.toISOString() || null,
            module: data.module,
            language: data.language,
            busy: data.busy,
            busySince: data.busySince?.toISOString() || null,
            conversations: data.conversations.map(
                (conversation) => ({
                    role: conversation.role,
                    text: conversation.text,
                    language: conversation.language
                })
            ),
            documents: data.documents.map(
                (document) => ({
                    id: document.id,
                    title: document.title,
                    text: document.text,
                    url: document.url
                })
            )
        });
    }
}