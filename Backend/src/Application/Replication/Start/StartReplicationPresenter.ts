import StartReplicationEntity from '../../../Core/Start/StartReplicationEntity';

export interface StartReplicationModel {
    version: number;
    module: string;
    language: string;
    busy: boolean;
    conversations: Array<{
        role: string;
        text: string;
        language: string;
    }>;
    documents: Array<{
        id: string;
        title: string;
        text: string;
        url: string | null;
    }>;
}

export default class StartReplicationPresenter {
    public present(data: StartReplicationEntity): StartReplicationModel {
        return {
            version: data.version,
            module: data.module,
            language: data.language,
            busy: data.busy,
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
        };
    }
}
