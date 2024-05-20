import GptUseCase from '../../Core/Gpt/GptUseCase';
import GptEntity from '../../Core/Gpt/GptEntity';
import BodyParser from './BodyParser';
import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import Presenter from './GptPresenter';


export default class GptController {
    constructor(
        private gptUseCase: GptUseCase,
        private bodyParser: BodyParser,
        private presenter: Presenter
    ) {
    }

    async main(event: any, context: any): Promise<any> {
        console.log('Event-Data:', event, context);

        const pastConversation: Array<ChatCompletionMessageParam> = this.bodyParser.parseBody(event?.body || '');

        try {
            let gpt: GptEntity = await this.gptUseCase.execute(pastConversation);
            console.log('Response:', gpt);

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: this.presenter.presentBod(gpt)
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: 'Unexpected error: ' + error
            };
        }
    }
}
