import Tokenizer from '../Tokenizer';
import * as uuid from 'uuid-random';

export default class S3 implements Tokenizer {
    private readonly s3Bucket: string;
    private readonly validTime: number;
    private S3: any;

    constructor(s3Bucket: string, S3: any, validTime: number) {
        this.validTime = validTime;
        this.S3 = S3;
        this.s3Bucket = s3Bucket;
    }

    async generate(now: number): Promise<string> {
        const key: string = 'admin/token';
        let token = uuid();
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key,
            Body: JSON.stringify({token: token, validUntil: now + this.validTime})
        };

        await this.S3.putObject(params).promise();

        return token;
    }
}
