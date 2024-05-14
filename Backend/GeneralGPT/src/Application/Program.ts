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

const pollyClient: PollyClient = new PollyClient();

/** Experimental area */
async function pollySpeech(inputText: string): Promise<string> {
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
    const response: SynthesizeSpeechCommandOutput = await pollyClient.send(command);

    return await response.AudioStream.transformToString('base64');
}

async function openAiSpeech(inputText: string): Promise<string> {
    const apiUrl: string = 'https://api.openai.com/v1/audio/speech';
    const headers: Record<string, string> = {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY || '',
        'Content-Type': 'application/json'
    };

    const data: Object = {
        model: 'tts-1',
        input: inputText,
        voice: 'nova',
        speed: 1
    };

    try {
        const response: Response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (response.ok == false) {
            console.error(new Error(`Error: ${response.statusText}`));
            return '';
        }

        const audioBuffer: ArrayBuffer = await response.arrayBuffer();

        const buffer: Buffer = Buffer.from(audioBuffer);
        return buffer.toString('base64');
    } catch (error) {
        console.error('Error generating speech:', error);
        return '';
    }
}

/** End of experimental area */

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
            console.log('Response:', gpt);

            const audio: string = gpt.say ? await openAiSpeech(gpt.say) : '';
            console.log('Audio-Length:', audio.length);

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
                    language: gpt.language,
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
