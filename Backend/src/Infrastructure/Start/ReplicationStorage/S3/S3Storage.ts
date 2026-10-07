import {DeleteObjectCommandInput, GetObjectCommandInput, GetObjectCommandOutput, PutObjectCommandInput, S3} from '@aws-sdk/client-s3';
import ReplicationConflictError from '../../../../Core/Start/ReplicationConflictError';
import ReplicationLoadResult from '../../../../Core/Start/ReplicationLoadResult';
import ReplicationStorage from '../../../../Core/Start/ReplicationStorage';
import StartReplicationEntity from '../../../../Core/Start/StartReplicationEntity';
import ReplicationParser from './ReplicationParser';
import ReplicationEncoder from './ReplicationEncoder';

export default class S3Storage implements ReplicationStorage {
    constructor(
        private s3: S3,
        private bucketName: string,
        private path: string,
        private replicationParser: ReplicationParser,
        private replicationEncoder: ReplicationEncoder
    ) {
    }

    public async loadSessionData(sessionId: string): Promise<ReplicationLoadResult> {
        try {
            const params: GetObjectCommandInput = {
                Bucket: this.bucketName,
                Key: this.createKey(sessionId)
            };
            const result: GetObjectCommandOutput = await this.s3.getObject(params);
            const body: string = result.Body ? await result.Body.transformToString() : '';
            const sessionData: StartReplicationEntity = this.replicationParser.parseReplication(body);

            sessionData.persisted = true;

            return new ReplicationLoadResult(sessionData, result.ETag || null);
        } catch (error) {
            if (this.isNotFoundError(error)) {
                return new ReplicationLoadResult(new StartReplicationEntity(), null);
            }

            throw error;
        }
    }

    public async saveSessionData(
        sessionId: string,
        data: StartReplicationEntity,
        revisionToken: string | null
    ): Promise<void> {
        const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: this.createKey(sessionId),
            Body: this.replicationEncoder.encodeReplication(data),
            ContentType: 'application/json',
            IfMatch: revisionToken || undefined,
            IfNoneMatch: revisionToken === null ? '*' : undefined
        };

        try {
            await this.s3.putObject(params);
        } catch (error) {
            if (this.isConflictError(error)) {
                throw new ReplicationConflictError();
            }

            throw error;
        }
    }

    public async deleteSessionData(sessionId: string): Promise<void> {
        const params: DeleteObjectCommandInput = {
            Bucket: this.bucketName,
            Key: this.createKey(sessionId)
        };
        await this.s3.deleteObject(params);
    }

    private createKey(sessionId: string): string {
        return `${this.path}${sessionId}.json`;
    }

    private isNotFoundError(error: unknown): boolean {
        const errorName: string | undefined = this.getErrorName(error);

        return errorName === 'NoSuchKey' || errorName === 'NotFound';
    }

    private isConflictError(error: unknown): boolean {
        const errorName: string | undefined = this.getErrorName(error);
        const statusCode: number | undefined = this.getStatusCode(error);

        return errorName === 'PreconditionFailed'
            || errorName === 'ConditionalRequestConflict'
            || statusCode === 412
            || statusCode === 409
            ;
    }

    private getErrorName(error: unknown): string | undefined {
        return typeof error === 'object' && error !== null && 'name' in error && typeof error.name === 'string'
            ? error.name
            : undefined
            ;
    }

    private getStatusCode(error: unknown): number | undefined {
        if (
            typeof error !== 'object'
            || error === null
            || !('$metadata' in error)
            || typeof error.$metadata !== 'object'
            || error.$metadata === null
            || !('httpStatusCode' in error.$metadata)
            || typeof error.$metadata.httpStatusCode !== 'number'
        ) {
            return undefined;
        }

        return error.$metadata.httpStatusCode;
    }
}
