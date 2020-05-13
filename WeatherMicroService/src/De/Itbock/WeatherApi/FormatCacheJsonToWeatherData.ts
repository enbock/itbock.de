import {WeatherData} from '../WeatherApi';
import Sun from './Sun';
import Cloud from './Cloud';
import Wind from './Wind';

export default class FormatApiJsonToWeatherData {
    format(json: any): WeatherData {
        const sun: Sun = new Sun();
        sun.rise = parseFloat(json.sun.rise);
        sun.set = parseFloat(json.sun.set);

        const cloud: Cloud = new Cloud();
        cloud.cloudiness = parseInt(json.cloud.cloudiness);
        cloud.visibility = parseInt(json.cloud.visibility);

        const wind: Wind = new Wind();
        wind.direction = parseInt(json.wind.direction);
        wind.speed = parseFloat(json.wind.speed);
        wind.temperature = parseFloat(json.wind.temperature);

        return {sun: sun, wind: wind, cloud: cloud};
    }
}
