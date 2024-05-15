import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {MfaService} from '../Core/Mfa/MfaService';
import {TokenPresenter} from './TokenPresenter';

export class Handler {
    private mfaService: MfaService;
    private tokenPresenter: TokenPresenter;

    constructor(mfaService: MfaService, tokenPresenter: TokenPresenter) {
        this.mfaService = mfaService;
        this.tokenPresenter = tokenPresenter;
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

        const secret = this.mfaService.generateSecret();
        const token = await this.mfaService.createToken(userId, secret);
        const issuer = 'YourAppName';

        const response = this.tokenPresenter.formatTokenResponse(token, secret, userId, issuer);

        return {
            statusCode: 200,
            body: response
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
