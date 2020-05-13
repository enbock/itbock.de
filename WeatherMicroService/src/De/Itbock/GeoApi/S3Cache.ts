import {GeoApi} from '../GeoApi';
import Position from './Position';
import FormatJsonToPosition from './FormatJsonToPosition';

export default class S3Cache implements GeoApi {
    private S3: any;
    private baseApi: GeoApi;
    private s3Bucket: string;
    private jsonFormatter: FormatJsonToPosition;

    constructor(baseApi: GeoApi, S3: any, s3Bucket: string, jsonFormatter: FormatJsonToPosition) {
        this.s3Bucket = s3Bucket;
        this.baseApi = baseApi;
        this.S3 = S3;
        this.jsonFormatter = jsonFormatter;
    }

    async getGeoData(lookupAddress): Promise<Position> {
        let data: Position;

        const key: string = 'GeoApi/Address-' + lookupAddress + '.json';
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key
        };

        try {
            const result = await this.S3.getObject(params).promise();
            data = this.jsonFormatter.format(JSON.parse(result.Body));
        } catch (notFoundError) {
            data = await this.baseApi.getGeoData(lookupAddress);
            params.Body = JSON.stringify(data);
            await this.S3.putObject(params).promise();
        }


        return data;
    }
}
