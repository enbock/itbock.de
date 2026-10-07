import EmbeddingClient from './EmbeddingClient';
import KnowledgeChunk from './KnowledgeChunk';
import KnowledgeStorage from './KnowledgeStorage';
import PageCatalogEntry from './PageCatalogEntry';
import {PAGE_CATALOG} from './PageCatalog';
import ScoredKnowledgeChunk from './ScoredKnowledgeChunk';
import cosineSimilarity from './cosineSimilarity';

export default class RetrievalUseCase {
    public static readonly DEFAULT_TOP_K: number = 4;
    public static readonly DEFAULT_MIN_SCORE: number = 0.2;

    constructor(
        private embeddingClient: EmbeddingClient,
        private knowledgeStorage: KnowledgeStorage
    ) {
    }

    public async retrieve(
        query: string,
        topK: number = RetrievalUseCase.DEFAULT_TOP_K,
        minScore: number = RetrievalUseCase.DEFAULT_MIN_SCORE
    ): Promise<Array<ScoredKnowledgeChunk>> {
        if (query.trim() === '' || topK <= 0) {
            return [];
        }

        const knowledgeIndex = await this.knowledgeStorage.loadIndex();
        if (knowledgeIndex.chunks.length === 0) {
            return [];
        }

        const queryEmbeddings: Array<Array<number>> = await this.embeddingClient.embed([query]);
        const queryEmbedding: Array<number> | undefined = queryEmbeddings[0];
        if (queryEmbedding === undefined || queryEmbedding.length === 0) {
            return [];
        }

        return knowledgeIndex.chunks
            .map((chunk: KnowledgeChunk): ScoredKnowledgeChunk => ({
                chunk,
                score: cosineSimilarity(queryEmbedding, chunk.embedding)
            }))
            .filter((entry: ScoredKnowledgeChunk): boolean => {
                return Number.isFinite(entry.score) && entry.score >= minScore;
            })
            .sort((left: ScoredKnowledgeChunk, right: ScoredKnowledgeChunk): number => {
                return right.score - left.score;
            })
            .slice(0, topK);
    }

    public async findChunks(ids: Array<string>): Promise<Array<KnowledgeChunk>> {
        if (ids.length === 0) {
            return [];
        }

        const knowledgeIndex = await this.knowledgeStorage.loadIndex();
        if (knowledgeIndex.chunks.length === 0) {
            return [];
        }

        const chunksById: Map<string, KnowledgeChunk> = new Map(
            knowledgeIndex.chunks.map((chunk: KnowledgeChunk): [string, KnowledgeChunk] => [chunk.id, chunk])
        );

        return ids.flatMap((id: string): Array<KnowledgeChunk> => {
            const chunk: KnowledgeChunk | undefined = chunksById.get(id);
            return chunk === undefined ? [] : [chunk];
        });
    }

    public async findChunksByDocumentId(documentId: string): Promise<Array<KnowledgeChunk>> {
        if (documentId.trim() === '') {
            return [];
        }

        const knowledgeIndex = await this.knowledgeStorage.loadIndex();

        return knowledgeIndex.chunks.filter((chunk: KnowledgeChunk): boolean => chunk.documentId === documentId);
    }

    public getPageCatalog(): Array<PageCatalogEntry> {
        return PAGE_CATALOG;
    }
}
