import KnowledgeModule from './KnowledgeModule';

export default interface KnowledgeChunk {
    id: string;
    documentId: string;
    title: string;
    module: KnowledgeModule;
    text: string;
    url: string | null;
    embedding: Array<number>;
}
