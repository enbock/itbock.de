import {GeoApi} from './De/Itbock/GeoApi';
import Data from './De/Itbock/Data';
import GeoApiAxios from './De/Itbock/GeoApi/Axios';
import GeoApiCache from './De/Itbock/GeoApi/S3Cache';
import Config from './Config';
import FormatJsonToPosition from './De/Itbock/GeoApi/FormatJsonToPosition';
import Position from './De/Itbock/GeoApi/Position';
import {WeatherApi, WeatherData} from './De/Itbock/WeatherApi';
import WeatherApiAxios from './De/Itbock/WeatherApi/Axios';
import WeatherApiCache from './De/Itbock/WeatherApi/S3Cache';
import WeatherApiRawFormatter from './De/Itbock/WeatherApi/FormatApiJsonToWeatherData';
import WeatherApiCacheFormatter from './De/Itbock/WeatherApi/FormatCacheJsonToWeatherData';

const now: number = Math.round(Date.now().valueOf() / 1000);
const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const config: Config = new Config();
const formatJsonToPosition = new FormatJsonToPosition();
const geoApi: GeoApi = new GeoApiCache(
    new GeoApiAxios(config.geoIpApiAccessKey, formatJsonToPosition),
    s3,
    config.s3Bucket,
    formatJsonToPosition
);
const weatherApi:WeatherApi = new WeatherApiCache(
    new WeatherApiAxios(config.weatherApiAccessKey, new WeatherApiRawFormatter()),
    s3,
    config.s3Bucket,
    new WeatherApiCacheFormatter(),
    now,
    60 * 60
);

exports.handler = async function (event/*, context*/) {

    const position: Position = await geoApi.getGeoData(event.requestContext.identity.sourceIp);
    const weather: WeatherData = await weatherApi.getCurrentWeather(position);

    const data: Data = new Data();
    data.position = position;
    data.sun = weather.sun;
    data.wind = weather.wind;
    data.cloud = weather.cloud;

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : 'https://www.itbock.de'
        },
        body: JSON.stringify(data)
    };
};
