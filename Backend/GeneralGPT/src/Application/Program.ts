import GptUseCase from '../Core/Gpt/GptUseCase';
import GptEntity from '../Core/Gpt/GptEntity';
import BodyParser from './BodyParser';
import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';

export default class Program {
    constructor(
        private gptUseCase: GptUseCase,
        private bodyParser: BodyParser
    ) {
    }

    async main(event: any, context: any): Promise<any> {
        console.log('Event-Data:', event, context);

        const pastConversation: Array<ChatCompletionMessageParam> = this.bodyParser.parseBody(event?.body || '');
        console.log("???>>>", pastConversation);

        try {
            let gpt: GptEntity = await this.gptUseCase.execute(pastConversation);

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    command: gpt.command || '',
                    say: gpt.say,
                    role: gpt.role
                })
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