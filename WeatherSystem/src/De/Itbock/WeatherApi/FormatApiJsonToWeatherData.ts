import {WeatherData} from '../WeatherApi';
import Sun from './Sun';
import Cloud from './Cloud';
import Wind from './Wind';

export default class FormatApiJsonToWeatherData {
    format(json: any): WeatherData {
        const sun: Sun = new Sun();
        sun.rise = parseFloat(json.sys.sunrise);
        sun.set = parseFloat(json.sys.sunset);

        const cloud: Cloud = new Cloud();
        cloud.cloudiness = parseInt(json.clouds.all);

        const wind: Wind = new Wind();
        wind.direction = parseInt(json.wind.deg);
        wind.speed = parseFloat(json.wind.speed);
        wind.temperature = parseFloat(json.main.temp);

        return {sun: sun, wind: wind, cloud: cloud};
    }
}
