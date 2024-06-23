import UserStorage from '../../../Core/UserStorage';
import UserEntity from '../../../Core/UserEntity';
import {GetObjectCommandInput, PutObjectCommandInput, S3} from '@aws-sdk/client-s3';
import {GetObjectCommandOutput} from '@aws-sdk/client-s3/dist-types/commands/GetObjectCommand';
import UserParser from './UserParser';
import UserEncoder from './UserEncoder';

export default class S3UserStore implements UserStorage {
    constructor(
        private s3: S3,
        private bucketName: string,
        private path: string,
        private userParser: UserParser,
        private userEncoder: UserEncoder
    ) {
    }

    public async loadUser(username: string): Promise<UserEntity> {
        try {
            const params: GetObjectCommandInput = {
                Bucket: this.bucketName,
                Key: `${this.path}${username}`
            };
            const result: GetObjectCommandOutput = await this.s3.getObject(params);
            return this.userParser.parseUser(result.Body?.toString() || '{}');
        } catch (error) {
            return new UserEntity();
        }
    }

    public async saveUser(user: UserEntity): Promise<void> {
        const params: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: `${this.path}${user.username}`,
            Body: this.userEncoder.encodeUser(user),
            ContentType: 'application/json'
        };
        await this.s3.putObject(params);
    }

    public async deleteUser(username: string): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.path}${username}`
        };
        await this.s3.deleteObject(params);
    }
}
