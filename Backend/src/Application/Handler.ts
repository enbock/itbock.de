import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import MfaService from '../Core/Mfa/MfaService';
import TokenPresenter from './TokenPresenter';

export default class Handler {

    constructor(
        private mfaService: MfaService,
        private tokenPresenter: TokenPresenter
    ) {
    }

    public async generateTokenHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'User ID is required'})
            };
        }

        const body = JSON.parse(event.body);
        const userId = body.userId;

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'User ID is required'})
            };
        }

        const uri: string = await this.mfaService.createToken(userId);

        return {
            statusCode: 200,
            body: this.tokenPresenter.formatTokenResponse(uri)
        };
    }

    public async validateTokenHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
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
