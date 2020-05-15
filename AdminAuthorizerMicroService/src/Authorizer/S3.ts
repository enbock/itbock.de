import Authorizer from '../Authorizer';

export default class S3 implements Authorizer {
    private readonly s3Bucket: string;
    private S3: any;

    constructor(s3Bucket: string, S3:any) {
        this.S3 = S3;
        this.s3Bucket = s3Bucket;
    }

    async authorize(token:string, now:number): Promise<boolean> {
        const key: string = 'admin/token';
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key,
        };

        try {
            const result = JSON.parse((await this.S3.getObject(params).promise()).Body);
            return token == result.token && now <= result.validUntil;
        } catch (notFoundError) {
            return false;
        }
    }
}
