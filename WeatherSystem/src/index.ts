const aws = require('aws-sdk');
import Data from "./De/Itbock/Data";
console.log('Loading function');
// const geoApi: GeoApi;
// const weatherApi: WeatherApi;

const s3 = new aws.S3({apiVersion: '2006-03-01'});

exports.handler = async function (event, context) {

    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    // const bucket: string = 'arn:aws:s3:::itbock.de';
    // const key: string = '';
    // const params = {
    //     Bucket: bucket,
    //     Key: key,
    // };
    // try {
    //     const {ContentType} = await s3.getObject(params).promise();
    //     console.log('CONTENT TYPE:', ContentType);
    //     return ContentType;
    // } catch (err) {
    //     console.log(err);
    //     const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    //     console.log(message);
    //     throw new Error(message);
    // }

    //
    // const position: Position = geoApi.getGeoData(ClientAddress);
    // const weather: WeatherData = weatherApi.getCurrentWeather(position);
    //
    // const data: Data = new Data();
    // data.position = position;
    // data.sun = weather.sun;
    // data.wind = weather.wind;
    //
    // const result: string = JSON.stringify(data);

    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({hello: {ip: event.requestContext.identity.sourceIp, data: new Data()}})
    };
}
