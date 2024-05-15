import TokenStorage from '../../Core/TokenStorage';
import AWS, {S3} from 'aws-sdk';
import {PromiseResult} from 'aws-sdk/lib/request';
import {AWSError} from 'aws-sdk/lib/error';

export default class S3TokenStore implements TokenStorage {
    constructor(
        private s3: AWS.S3,
        private bucketName: string,
        private path: string
    ) {
    }

    public async getToken(userId: string): Promise<string | undefined> {
        try {
            const params: S3.Types.GetObjectRequest = {
                Bucket: this.bucketName,
                Key: `${this.path}${userId}`
            };
            const result: PromiseResult<S3.Types.GetObjectOutput, AWSError> = await this.s3.getObject(params).promise();
            return result.Body?.toString('utf-8');
        } catch (error) {
            if ((<any>error).code === 'NoSuchKey') {
                return undefined;
            }
            throw error;
        }
    }

    public async setToken(userId: string, token: string): Promise<void> {
        const params: S3.Types.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: `${this.path}${userId}`,
            Body: token,
            ContentType: 'text/plain'
        };
        await this.s3.putObject(params).promise();
    }

    public async deleteToken(userId: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.path}${userId}`
        };
        await this.s3.deleteObject(params).promise();
    }
}
