import MfaService from '../../Core/Mfa/MfaService';
import TokenPresenter from './TokenPresenter';
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

export default class GenerateTokenController {

    constructor(
        private mfaService: MfaService,
        private tokenPresenter: TokenPresenter
    ) {
    }

    // noinspection JSUnusedLocalSymbols
    public async handle(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
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
}
