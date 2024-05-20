import MfaService from '../../Core/Mfa/MfaService';
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

export default class ValidateTokenController {

    constructor(
        private mfaService: MfaService
    ) {
    }

    // noinspection JSUnusedLocalSymbols
    public async handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'User ID and token are required'})
            };
        }

        const body = JSON.parse(event.body);
        const userId = body.userId;
        const token = body.token;

        if (!userId || !token) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'User ID and token are required'})
            };
        }

        const isValid = await this.mfaService.validateToken(userId, token);

        if (isValid) {
            return {
                statusCode: 200,
                body: JSON.stringify({message: 'Token is valid'})
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({message: 'Invalid token'})
            };
        }
    }
}
