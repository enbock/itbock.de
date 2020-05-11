import {GeoApi} from './De/Itbock/GeoApi';
import Data from './De/Itbock/Data';
import GeoApiAxios from './De/Itbock/GeoApi/Axios';
import GeoApiCache from './De/Itbock/GeoApi/S3Cache';
import Config from './Config';
import FormatJsonToPosition from './De/Itbock/GeoApi/FormatJsonToPosition';
import Position from './De/Itbock/GeoApi/Position';

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

exports.handler = async function (event/*, context*/) {

    const position: Position = await geoApi.getGeoData(event.requestContext.identity.sourceIp);
    // const weather: WeatherData = weatherApi.getCurrentWeather(position);
    //
    const data: Data = new Data();
    data.position = position;
    // data.sun = weather.sun;
    // data.wind = weather.wind;
    //
    // const result: string = JSON.stringify(data);

    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(data)
    };
};
