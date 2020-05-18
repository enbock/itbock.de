import Config from './Config';
import GridStorage from './GridStorage';
import GridStorageS3 from './GridStorage/S3';

const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const config: Config = new Config();

const storage: GridStorage = new GridStorageS3(config.s3Bucket, s3);

exports.handler = async function (event/*, context*/) {
    console.log(event);

    const data: any = JSON.parse(event.body);
    await storage.save(data.Identifier, data);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*' //'https://www.itbock.de'
        },
        body: data.Identifier
    };
};
