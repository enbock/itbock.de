import KnowledgeChunk from './KnowledgeChunk';

export default interface KnowledgeIndex {
    model: string;
    createdAt: string;
    chunks: Array<KnowledgeChunk>;
}

export function createEmptyKnowledgeIndex(): KnowledgeIndex {
    return {
        model: '',
        createdAt: '',
        chunks: []
    };
}
