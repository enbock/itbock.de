import GptUseCase from '../Core/Gpt/GptUseCase';
import GptEntity from '../Core/Gpt/GptEntity';
import BodyParser from './BodyParser';
import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import {
    PollyClient,
    SynthesizeSpeechCommand,
    SynthesizeSpeechCommandInput,
    SynthesizeSpeechCommandOutput
} from '@aws-sdk/client-polly';

const client: PollyClient = new PollyClient();

async function speech(inputText: string): Promise<string> {
    const input: SynthesizeSpeechCommandInput = {
        Engine: 'neural',
        LanguageCode: 'de-DE',
        OutputFormat: 'mp3',
        SampleRate: '24000',
        Text: inputText,
        TextType: 'text',
        VoiceId: 'Vicki'
    };
    const command: SynthesizeSpeechCommand = new SynthesizeSpeechCommand(input);
    const response: SynthesizeSpeechCommandOutput = await client.send(command);

    return await response.AudioStream.transformToString('base64');
}

export default class Program {
    constructor(
        private gptUseCase: GptUseCase,
        private bodyParser: BodyParser
    ) {
    }

    async main(event: any, context: any): Promise<any> {
        console.log('Event-Data:', event, context);

        const pastConversation: Array<ChatCompletionMessageParam> = this.bodyParser.parseBody(event?.body || '');

        try {
            let gpt: GptEntity = await this.gptUseCase.execute(pastConversation);
            const audio:string = gpt.say ? await speech(gpt.say) : '';

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commands: gpt.commands || '',
                    say: gpt.say,
                    role: gpt.role,
                    audio: audio
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
