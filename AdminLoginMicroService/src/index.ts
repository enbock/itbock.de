import Config from './Config';
import Authorizer from './Authorizer';
import AuthorizerS3 from './Authorizer/S3';
import Tokenizer from './Tokenizer';
import TokenizerS3 from './Tokenizer/S3';

const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const config: Config = new Config();

const authorizer: Authorizer = new AuthorizerS3(config.s3Bucket, s3);
const tokenizer: Tokenizer = new TokenizerS3(config.s3Bucket, s3, 60 * 60);

exports.handler = async function (event/*, context*/) {
    const now: number = Math.round(Date.now().valueOf() / 1000);
    let token: string | null = null;

    if (await authorizer.login(event.body) == true) {
        token = await tokenizer.generate(now);
    }

    return {
        statusCode: token != null ? 200 : 403,
        headers: {
            'Access-Control-Allow-Origin': '*' //'https://www.itbock.de'
        },
        body: token != null ? JSON.stringify({token: token}) : 'Not Authorized'
    };
};
