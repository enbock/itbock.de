import TokenStorage from '../../../Core/TokenStorage';
import {GetObjectCommandInput, PutObjectCommandInput, S3} from '@aws-sdk/client-s3';
import {GetObjectCommandOutput} from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand';

export default class S3TokenStore implements TokenStorage {
    constructor(
        private s3: S3,
        private bucketName: string,
        private path: string
    ) {
    }

    public async getToken(userId: string): Promise<string | undefined> {
        try {
            const params: GetObjectCommandInput = {
                Bucket: this.bucketName,
                Key: `${this.path}${userId}`
            };
            const result: GetObjectCommandOutput = await this.s3.getObject(params);
            return result.Body?.toString();
        } catch (error) {
            if ((<any>error).code === 'NoSuchKey') {
                return undefined;
            }
            throw error;
        }
    }

    public async setToken(userId: string, token: string): Promise<void> {
        const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: `${this.path}${userId}`,
            Body: token,
            ContentType: 'text/plain'
        };
        await this.s3.putObject(params);
    }

    public async deleteToken(userId: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.path}${userId}`
        };
        await this.s3.deleteObject(params);
    }
}
