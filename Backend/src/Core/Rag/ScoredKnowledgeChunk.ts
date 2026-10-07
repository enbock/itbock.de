import KnowledgeChunk from './KnowledgeChunk';

export default interface ScoredKnowledgeChunk {
    chunk: KnowledgeChunk;
    score: number;
}
