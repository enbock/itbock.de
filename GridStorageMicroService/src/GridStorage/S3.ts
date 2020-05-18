import GridStorage from '../GridStorage';

export default class S3 implements GridStorage {
    private readonly s3Bucket: string;
    private S3: any;

    constructor(s3Bucket: string, S3: any) {
        this.S3 = S3;
        this.s3Bucket = s3Bucket;
    }

    async save(name: string, data: any): Promise<void> {
        const key: string = 'grid-data/' + name + '.json';
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key,
            Body: JSON.stringify(data)
        };
        await this.S3.putObject(params).promise();
    }
}
