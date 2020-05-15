import Tokenizer from '../Tokenizer';

export default class S3 implements Tokenizer {
    private readonly s3Bucket: string;
    private readonly validTime: number;
    private S3: any;

    constructor(s3Bucket: string, S3: any, validTime: number) {
        this.validTime = validTime;
        this.S3 = S3;
        this.s3Bucket = s3Bucket;
    }

    async update(token:string, now: number): Promise<void> {
        const key: string = 'admin/token';
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key,
            Body: JSON.stringify({token: token, validUntil: now + this.validTime})
        };

        await this.S3.putObject(params).promise();
    }
}
