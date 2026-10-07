import assert from 'node:assert/strict';
import test from 'node:test';
import EmbeddingClient from '../../src/Core/Rag/EmbeddingClient';
import KnowledgeChunk from '../../src/Core/Rag/KnowledgeChunk';
import KnowledgeIndex, {createEmptyKnowledgeIndex} from '../../src/Core/Rag/KnowledgeIndex';
import KnowledgeStorage from '../../src/Core/Rag/KnowledgeStorage';
import RetrievalUseCase from '../../src/Core/Rag/RetrievalUseCase';

class FakeEmbeddingClient implements EmbeddingClient {
    public calls: Array<Array<string>> = [];

    constructor(
        private responses: Map<string, Array<number>>
    ) {
    }

    public async embed(texts: Array<string>): Promise<Array<Array<number>>> {
        this.calls.push(texts);

        return texts.map((text: string): Array<number> => {
            return this.responses.get(text) || [];
        });
    }
}

class FakeKnowledgeStorage implements KnowledgeStorage {
    constructor(
        private knowledgeIndex: KnowledgeIndex
    ) {
    }

    public async loadIndex(): Promise<KnowledgeIndex> {
        return this.knowledgeIndex;
    }

    public async saveIndex(index: KnowledgeIndex): Promise<void> {
        this.knowledgeIndex = index;
    }
}

function createChunk(id: string, embedding: Array<number>): KnowledgeChunk {
    return {
        id,
        documentId: id,
        title: id,
        module: 'INFO',
        text: id,
        url: null,
        embedding
    };
}

test('RetrievalUseCase retrieves top ranked chunks and applies minScore', async (): Promise<void> => {
    const storage = new FakeKnowledgeStorage({
        model: 'test-model',
        createdAt: '2026-10-07T00:00:00.000Z',
        chunks: [
            createChunk('about-endre#0', [1, 0]),
            createChunk('bock-laboratories#0', [0.8, 0.2]),
            createChunk('site-technology#0', [0, 1]),
            createChunk('old-homepage#0', [-1, 0])
        ]
    });
    const embeddings = new FakeEmbeddingClient(
        new Map([
            ['developer work', [1, 0]]
        ])
    );
    const useCase = new RetrievalUseCase(embeddings, storage);

    const result = await useCase.retrieve('developer work', 2, 0.5);

    assert.deepStrictEqual(
        result.map((entry) => entry.chunk.id),
        ['about-endre#0', 'bock-laboratories#0']
    );
    assert.ok(result[0].score >= result[1].score);
    assert.deepStrictEqual(embeddings.calls, [['developer work']]);
});

test('RetrievalUseCase filters unknown chunk ids and keeps requested order', async (): Promise<void> => {
    const storage = new FakeKnowledgeStorage({
        model: 'test-model',
        createdAt: '2026-10-07T00:00:00.000Z',
        chunks: [
            createChunk('about-endre#0', [1, 0]),
            createChunk('bock-laboratories#0', [0.8, 0.2])
        ]
    });
    const useCase = new RetrievalUseCase(new FakeEmbeddingClient(new Map()), storage);

    const result = await useCase.findChunks(['bock-laboratories#0', 'missing#0', 'about-endre#0']);

    assert.deepStrictEqual(
        result.map((chunk) => chunk.id),
        ['bock-laboratories#0', 'about-endre#0']
    );
});

test('RetrievalUseCase loads all chunks of a document in index order', async (): Promise<void> => {
    const storage = new FakeKnowledgeStorage({
        model: 'test-model',
        createdAt: '2026-10-07T00:00:00.000Z',
        chunks: [
            {...createChunk('old-homepage#0', [1, 0]), documentId: 'old-homepage'},
            {...createChunk('old-homepage#1', [0.8, 0.2]), documentId: 'old-homepage'},
            createChunk('about-endre#0', [0, 1])
        ]
    });
    const useCase = new RetrievalUseCase(new FakeEmbeddingClient(new Map()), storage);

    const result = await useCase.findChunksByDocumentId('old-homepage');

    assert.deepStrictEqual(
        result.map((chunk) => chunk.id),
        ['old-homepage#0', 'old-homepage#1']
    );
});

test(
    'RetrievalUseCase returns empty results for an empty index without embedding requests',
    async (): Promise<void> => {
        const storage = new FakeKnowledgeStorage(createEmptyKnowledgeIndex());
        const embeddings = new FakeEmbeddingClient(new Map());
        const useCase = new RetrievalUseCase(embeddings, storage);

        assert.deepStrictEqual(await useCase.retrieve('anything'), []);
        assert.deepStrictEqual(await useCase.findChunks(['about-endre#0']), []);
        assert.deepStrictEqual(await useCase.findChunksByDocumentId('about-endre'), []);
        assert.deepStrictEqual(embeddings.calls, []);
    }
);
