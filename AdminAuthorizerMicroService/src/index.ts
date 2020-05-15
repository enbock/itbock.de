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
    console.log(event);
    const now: number = Math.round(Date.now().valueOf() / 1000);
    const token: string = event.headers['admin-token'];
    const authorized: boolean = await authorizer.authorize(token, now);

    if (authorized == true) {
        await tokenizer.update(token, now);
    }

    console.log('Authorize for', event.methodArn, 'with token', token, 'was', (authorized ? 'successful.' : 'failed.'));

    return {
        principalId: 'admin',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: authorized ? 'Allow' : 'Deny',
                    Resource: event.methodArn
                }
            ]
        },
        context: {},
        usageIdentifierKey: authorized ? '' : token
    };
};
