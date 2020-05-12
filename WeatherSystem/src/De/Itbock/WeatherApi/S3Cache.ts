import FormatCacheJsonToWeatherData from './FormatCacheJsonToWeatherData';
import {WeatherApi, WeatherData} from '../WeatherApi';
import Position from '../GeoApi/Position';

export default class S3Cache implements WeatherApi {
    private S3: any;
    private baseApi: WeatherApi;
    private cacheTime: number;
    private now: number;
    private s3Bucket: string;
    private jsonFormatter: FormatCacheJsonToWeatherData;

    constructor(
        baseApi: WeatherApi,
        S3: any,
        s3Bucket: string,
        jsonFormatter: FormatCacheJsonToWeatherData,
        now: number,
        cacheTime: number
    ) {
        this.cacheTime = cacheTime;
        this.now = now;
        this.s3Bucket = s3Bucket;
        this.baseApi = baseApi;
        this.S3 = S3;
        this.jsonFormatter = jsonFormatter;
    }

    async getCurrentWeather(position: Position): Promise<WeatherData> {
        let data: WeatherData;

        const key: string = 'WeatherApi/' + position.latitude + '_' + position.longitude + '.json';
        const params: any = {
            Bucket: this.s3Bucket,
            Key: key
        };

        try {
            data = await this.loadFromCache(params);
        } catch (noDataError) {
            data = await this.baseApi.getCurrentWeather(position);
            params.Body = JSON.stringify({data: data, timestamp: this.now + this.cacheTime});
            await this.S3.putObject(params).promise();
        }

        return data;
    }

    private async loadFromCache(params: any): Promise<WeatherData> {

        let json: any;
        try {
            const result = await this.S3.getObject(params).promise();
            json = JSON.parse(result.Body);
        } catch (notFoundError) {
            throw new Error('No data');
        }

        const timestamp: number = json.timestamp;
        if (timestamp < this.now) {
            throw new Error('No data');
        }

        return this.jsonFormatter.format(json.data);
    }
}
