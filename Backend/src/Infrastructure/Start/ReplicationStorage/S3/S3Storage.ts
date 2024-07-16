import { GetObjectCommandInput, PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand';
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

    public async loadSessionData(sessionId: string): Promise<StartReplicationEntity> {
        try {
            const params: GetObjectCommandInput = {
                Bucket: this.bucketName,
                Key: `${this.path}${sessionId}`
            };
            const result: GetObjectCommandOutput = await this.s3.getObject(params);
            return this.replicationParser.parseReplication(result.Body?.toString() || '{}');
        } catch (error) {
            return new StartReplicationEntity();
        }
    }

    public async saveSessionData(sessionId: string, data: StartReplicationEntity): Promise<void> {
        const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: `${this.path}${sessionId}`,
            Body: this.replicationEncoder.encodeReplication(data),
            ContentType: 'application/json'
        };
        await this.s3.putObject(params);
    }

    public async deleteSessionData(sessionId: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.path}${sessionId}`
        };
        await this.s3.deleteObject(params);
    }
}
