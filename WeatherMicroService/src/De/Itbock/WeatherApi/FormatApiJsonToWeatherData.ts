import {WeatherData} from '../WeatherApi';
import Sun from './Sun';
import Cloud from './Cloud';
import Wind from './Wind';

export default class FormatApiJsonToWeatherData {
    format(json: any): WeatherData {
        const sun: Sun = new Sun();
        sun.rise = parseFloat(json.sys.sunrise) || 0;
        sun.set = parseFloat(json.sys.sunset) || 0;

        const cloud: Cloud = new Cloud();
        cloud.cloudiness = parseInt(json.clouds.all) || 0;

        let visibility:number = parseInt(json.visibility);
        if (!visibility && visibility !== 0) visibility = 20000;
        cloud.visibility = visibility;

        const wind: Wind = new Wind();
        wind.direction = parseInt(json.wind.deg) || 0;
        wind.speed = parseFloat(json.wind.speed) || 0;
        wind.temperature = parseFloat(json.main.temp) || 0;

        return {sun: sun, wind: wind, cloud: cloud};
    }
}
