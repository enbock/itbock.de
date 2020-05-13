import {GeoApi} from '../GeoApi';
import Position from './Position';
import FormatJsonToPosition from './FormatJsonToPosition';
import Axios from 'axios';


export default class Http implements GeoApi {
    private readonly accessKey: string;
    private jsonFormatter: FormatJsonToPosition;

    constructor(accessKey: string, jsonFormatter: FormatJsonToPosition) {
        this.accessKey = accessKey;
        this.jsonFormatter = jsonFormatter;
    }

    async getGeoData(lookupAddress): Promise<Position> {
        console.log("Load Api: [Geo]", lookupAddress);
        const response: any = await Axios('http://api.ipstack.com/' + lookupAddress + '?access_key=' + this.accessKey);
        const json: any = response.data;

        return this.jsonFormatter.format(json);
    }
}
