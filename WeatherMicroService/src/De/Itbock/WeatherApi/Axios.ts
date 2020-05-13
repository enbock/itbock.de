import Axios from 'axios';
import {WeatherApi, WeatherData} from '../WeatherApi';
import Position from '../GeoApi/Position';
import FormatApiJsonToWeatherData from './FormatApiJsonToWeatherData';


export default class Http implements WeatherApi {
    private readonly accessKey: string;
    private jsonFormatter: FormatApiJsonToWeatherData;

    constructor(accessKey: string, jsonFormatter: FormatApiJsonToWeatherData) {
        this.accessKey = accessKey;
        this.jsonFormatter = jsonFormatter;
    }

    async getCurrentWeather(position: Position): Promise<WeatherData> {
        console.log("Load Api: [Weather]", position);
        const response: any = await Axios(
            'http://api.openweathermap.org/data/2.5/weather?' +
            'lat=' + position.latitude + '&lon=' + position.longitude + '&appid=' + this.accessKey + '&units=metric'
        );
        const json: any = response.data;

        return this.jsonFormatter.format(json);
    }
}
