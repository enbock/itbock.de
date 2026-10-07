import assert from 'node:assert/strict';
import test from 'node:test';
import {S3} from '@aws-sdk/client-s3';
import KnowledgeIndex, {createEmptyKnowledgeIndex} from '../../src/Core/Rag/KnowledgeIndex';
import S3KnowledgeStorage from '../../src/Infrastructure/Rag/S3KnowledgeStorage';

class FakeClock {
    private current: number = 0;

    public now = (): number => this.current;

    public advance(milliseconds: number): void {
        this.current += milliseconds;
    }
}

class FakeBody {
    constructor(
        private content: string
    ) {
    }

    public async transformToString(): Promise<string> {
        return this.content;
    }
}

class FakeS3 {
    public eTag: string | undefined;
    public body: string | null;
    public getObjectCalls: number = 0;
    public headObjectCalls: number = 0;
    public putObjectCalls: number = 0;

    constructor(
        body: string | null,
        eTag: string | undefined
    ) {
        this.body = body;
        this.eTag = eTag;
    }

    public async getObject(): Promise<{Body?: FakeBody; ETag?: string}> {
        this.getObjectCalls += 1;
        if (this.body === null) {
            const error: {name: string} = {name: 'NoSuchKey'};
            throw error;
        }

        return {
            Body: new FakeBody(this.body),
            ETag: this.eTag
        };
    }

    public async headObject(): Promise<{ETag?: string}> {
        this.headObjectCalls += 1;
        if (this.body === null) {
            const error: {name: string} = {name: 'NotFound'};
            throw error;
        }

        return {
            ETag: this.eTag
        };
    }

    public async putObject(params: {Body: string}): Promise<{ETag: string}> {
        this.putObjectCalls += 1;
        this.body = params.Body;
        this.eTag = `"saved-${this.putObjectCalls}"`;

        return {
            ETag: this.eTag
        };
    }
}

function createIndex(id: string): KnowledgeIndex {
    return {
        model: 'text-embedding-3-small',
        createdAt: '2026-10-07T00:00:00.000Z',
        chunks: [
            {
                id,
                documentId: id,
                title: id,
                module: 'INFO',
                text: `text for ${id}`,
                url: null,
                embedding: [1, 0]
            }
        ]
    };
}

test('S3KnowledgeStorage caches and revalidates the knowledge index via ETag', async (): Promise<void> => {
    const firstIndex = createIndex('about-endre#0');
    const secondIndex = createIndex('site-technology#0');
    const fakeS3 = new FakeS3(JSON.stringify(firstIndex), '"etag-1"');
    const clock = new FakeClock();
    const storage = new S3KnowledgeStorage(
        fakeS3 as unknown as S3,
        'bucket',
        'knowledge/',
        clock.now,
        5_000
    );

    assert.deepStrictEqual(await storage.loadIndex(), firstIndex);
    assert.equal(fakeS3.getObjectCalls, 1);
    assert.equal(fakeS3.headObjectCalls, 0);

    assert.deepStrictEqual(await storage.loadIndex(), firstIndex);
    assert.equal(fakeS3.getObjectCalls, 1);
    assert.equal(fakeS3.headObjectCalls, 0);

    clock.advance(5_001);
    assert.deepStrictEqual(await storage.loadIndex(), firstIndex);
    assert.equal(fakeS3.headObjectCalls, 1);
    assert.equal(fakeS3.getObjectCalls, 1);

    fakeS3.body = JSON.stringify(secondIndex);
    fakeS3.eTag = '"etag-2"';

    clock.advance(5_001);
    assert.deepStrictEqual(await storage.loadIndex(), secondIndex);
    assert.equal(fakeS3.headObjectCalls, 2);
    assert.equal(fakeS3.getObjectCalls, 2);
});

test(
    'S3KnowledgeStorage returns an empty index for a missing object and updates cache on save',
    async (): Promise<void> => {
        const fakeS3 = new FakeS3(null, undefined);
        const clock = new FakeClock();
        const storage = new S3KnowledgeStorage(
            fakeS3 as unknown as S3,
            'bucket',
            'knowledge/',
            clock.now,
            5_000
        );

        assert.deepStrictEqual(await storage.loadIndex(), createEmptyKnowledgeIndex());
        assert.equal(fakeS3.getObjectCalls, 1);

        const savedIndex = createIndex('bock-laboratories#0');
        await storage.saveIndex(savedIndex);
        assert.equal(fakeS3.putObjectCalls, 1);
        assert.deepStrictEqual(await storage.loadIndex(), savedIndex);
    }
);
