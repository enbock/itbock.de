import {GetObjectCommandInput, HeadObjectCommandInput, PutObjectCommandInput, S3} from '@aws-sdk/client-s3';
import KnowledgeChunk from '../../Core/Rag/KnowledgeChunk';
import KnowledgeIndex, {createEmptyKnowledgeIndex} from '../../Core/Rag/KnowledgeIndex';
import KnowledgeModule from '../../Core/Rag/KnowledgeModule';
import KnowledgeStorage from '../../Core/Rag/KnowledgeStorage';

type CachedKnowledgeIndex = {
    eTag: string | null;
    checkedAt: number;
    index: KnowledgeIndex;
};

export default class S3KnowledgeStorage implements KnowledgeStorage {
    private static readonly DEFAULT_REVALIDATE_AFTER_MS: number = 5 * 60 * 1000;
    private static readonly SUPPORTED_MODULES: Array<KnowledgeModule> = [
        'START_SCREEN',
        'CONVERSATION',
        'OLD_PAGE',
        'INFO'
    ];

    private cache: CachedKnowledgeIndex | null = null;

    constructor(
        private s3: S3,
        private bucketName: string,
        private path: string,
        private now: () => number = (): number => Date.now(),
        private revalidateAfterMs: number = S3KnowledgeStorage.DEFAULT_REVALIDATE_AFTER_MS
    ) {
    }

    public async loadIndex(): Promise<KnowledgeIndex> {
        const now: number = this.now();

        if (this.cache !== null && now - this.cache.checkedAt < this.revalidateAfterMs) {
            return this.cache.index;
        }

        if (this.cache === null) {
            return await this.fetchIndex();
        }

        return await this.revalidateCache();
    }

    public async saveIndex(index: KnowledgeIndex): Promise<void> {
        const normalizedIndex: KnowledgeIndex = this.normalizeIndex(index);
        const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: this.getKey(),
            Body: JSON.stringify(normalizedIndex),
            ContentType: 'application/json'
        };
        const result = await this.s3.putObject(params);

        this.cache = {
            eTag: this.normalizeETag(result.ETag),
            checkedAt: this.now(),
            index: normalizedIndex
        };
    }

    private async revalidateCache(): Promise<KnowledgeIndex> {
        const params: HeadObjectCommandInput = {
            Bucket: this.bucketName,
            Key: this.getKey()
        };

        try {
            const result = await this.s3.headObject(params);
            const currentETag: string | null = this.normalizeETag(result.ETag);

            if (this.cache !== null && currentETag === this.cache.eTag) {
                this.cache.checkedAt = this.now();
                return this.cache.index;
            }

            return await this.fetchIndex();
        } catch (error) {
            if (this.isMissingObject(error)) {
                return this.updateCache(createEmptyKnowledgeIndex(), null);
            }

            throw error;
        }
    }

    private async fetchIndex(): Promise<KnowledgeIndex> {
        const params: GetObjectCommandInput = {
            Bucket: this.bucketName,
            Key: this.getKey()
        };

        try {
            const result = await this.s3.getObject(params);
            const body: string = await result.Body?.transformToString() || '';
            const knowledgeIndex: KnowledgeIndex = this.parseIndex(body);
            return this.updateCache(knowledgeIndex, this.normalizeETag(result.ETag));
        } catch (error) {
            if (this.isMissingObject(error)) {
                return this.updateCache(createEmptyKnowledgeIndex(), null);
            }

            throw error;
        }
    }

    private updateCache(index: KnowledgeIndex, eTag: string | null): KnowledgeIndex {
        this.cache = {
            eTag,
            checkedAt: this.now(),
            index
        };

        return index;
    }

    private parseIndex(data: string): KnowledgeIndex {
        if (data.trim() === '') {
            return createEmptyKnowledgeIndex();
        }

        try {
            const parsed: Json = JSON.parse(data);
            return this.normalizeIndex(parsed);
        } catch {
            return createEmptyKnowledgeIndex();
        }
    }

    private normalizeIndex(value: Json): KnowledgeIndex {
        const rawChunks: Array<Json> = Array.isArray(value?.chunks) ? value.chunks : [];
        const chunks: Array<KnowledgeChunk> = rawChunks.flatMap((chunk: Json): Array<KnowledgeChunk> => {
            const normalizedChunk: KnowledgeChunk | null = this.normalizeChunk(chunk);
            return normalizedChunk === null ? [] : [normalizedChunk];
        });

        return {
            model: typeof value?.model === 'string' ? value.model : '',
            createdAt: typeof value?.createdAt === 'string' ? value.createdAt : '',
            chunks
        };
    }

    private normalizeChunk(value: Json): KnowledgeChunk | null {
        if (
            typeof value?.id !== 'string'
            || typeof value?.documentId !== 'string'
            || typeof value?.title !== 'string'
            || typeof value?.text !== 'string'
            || this.isModule(value?.module) === false
            || this.isUrl(value?.url) === false
            || this.isEmbedding(value?.embedding) === false
        ) {
            return null;
        }

        return {
            id: value.id,
            documentId: value.documentId,
            title: value.title,
            module: value.module,
            text: value.text,
            url: value.url,
            embedding: value.embedding
        };
    }

    private isModule(value: unknown): value is KnowledgeModule {
        return typeof value === 'string' && S3KnowledgeStorage.SUPPORTED_MODULES.includes(value as KnowledgeModule);
    }

    private isUrl(value: unknown): value is string | null {
        return value === null || typeof value === 'string';
    }

    private isEmbedding(value: unknown): value is Array<number> {
        return Array.isArray(value) && value.every((entry: unknown): boolean => typeof entry === 'number');
    }

    private isMissingObject(error: unknown): boolean {
        return this.readErrorCode(error) === 'NoSuchKey' || this.readErrorCode(error) === 'NotFound';
    }

    private readErrorCode(error: unknown): string | null {
        if (typeof error !== 'object' || error === null) {
            return null;
        }

        const codedError: {code?: unknown; name?: unknown} = error as {code?: unknown; name?: unknown};
        if (typeof codedError.code === 'string') {
            return codedError.code;
        }

        if (typeof codedError.name === 'string') {
            return codedError.name;
        }

        return null;
    }

    private normalizeETag(value: string | undefined): string | null {
        return typeof value === 'string' && value !== '' ? value : null;
    }

    private getKey(): string {
        return `${this.path}index.json`;
    }
}
