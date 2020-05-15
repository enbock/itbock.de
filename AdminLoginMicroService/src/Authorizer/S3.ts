import Authorizer from '../Authorizer';

export default class S3 implements Authorizer {
    private readonly s3Bucket: string;
    private S3: any;

    constructor(s3Bucket: string, S3: any) {
        this.S3 = S3;
        this.s3Bucket = s3Bucket;
    }

    async login(password: string): Promise<boolean> {

        const key: string = 'admin/password';
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key
        };

        try {
            const result = await this.S3.getObject(params).promise();
            return result.Body == password;
        } catch (notFoundError) {
            return false;
        }
    }
}
