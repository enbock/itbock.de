import I18nUseCase from '../../Core/Gpt/I18nUseCase/I18nUseCase';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import TranslationRequest from '../../Core/Gpt/I18nUseCase/TranslationRequest';
import TranslationResponse from '../../Core/Gpt/I18nUseCase/TranslationResponse';

export default class I18nController {
    constructor(private i18nUseCase: I18nUseCase) {
    }

    public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: 'Request body is missing'})
                };
            }

            const requestBody = JSON.parse(event.body);
            const data = requestBody.data;
            const language = requestBody.language;

            if (!data || !language) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: 'Data and language are required'})
                };
            }

            const translationRequest: TranslationRequest = {data, language};
            const translationResponse: TranslationResponse = {data: {}};

            await this.i18nUseCase.translate(translationRequest, translationResponse);

            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: JSON.stringify(translationResponse)
            };
        } catch (error) {
            console.error('Error processing request:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Unexpected error: ' + error})
            };
        }
    }
}
