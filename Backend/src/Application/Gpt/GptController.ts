import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import GptUseCase from '../../Core/Gpt/UseCase/GptUseCase';
import GptEntity from '../../Core/Gpt/GptEntity';
import BodyParser from './BodyParser';
import {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import Presenter from './GptPresenter';
import InvalidSessionIdError from '../../Core/Start/InvalidSessionIdError';
import SessionBusyError from '../../Core/Start/SessionBusyError';
import SessionId from '../../Core/Start/SessionId';


export default class GptController {
    private readonly responseHeaders: Record<string, string> = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    constructor(
        private gptUseCase: GptUseCase,
        private bodyParser: BodyParser,
        private presenter: Presenter
    ) {
    }

    public async main(event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
        const pastConversation: Array<ChatCompletionMessageParam> = this.bodyParser.parseBody(event?.body || '');
        const rawSessionId: string = this.getHeaderValue(event, 'session-id');

        try {
            const normalizedSessionId: string | undefined = rawSessionId
                ? SessionId.normalize(rawSessionId)
                : undefined
                ;
            const gpt: GptEntity = await this.gptUseCase.execute(pastConversation, normalizedSessionId);

            return {
                statusCode: 200,
                headers: this.responseHeaders,
                body: this.presenter.presentBod(gpt)
            };
        } catch (error) {
            if (error instanceof InvalidSessionIdError) {
                return {
                    statusCode: 400,
                    headers: this.responseHeaders,
                    body: JSON.stringify({message: error.message})
                };
            }

            if (error instanceof SessionBusyError) {
                return {
                    statusCode: 409,
                    headers: this.responseHeaders,
                    body: JSON.stringify({message: error.message})
                };
            }

            console.error(error);
            return {
                statusCode: 500,
                headers: this.responseHeaders,
                body: JSON.stringify({message: 'Unexpected error'})
            };
        }
    }

    private getHeaderValue(event: APIGatewayProxyEvent, headerName: string): string {
        const headerEntry: [string, string | undefined] | undefined = Object.entries(event.headers || {}).find(
            ([name]: [string, string | undefined]): boolean => name.toLowerCase() === headerName.toLowerCase()
        );

        return headerEntry?.[1] || '';
    }
}
