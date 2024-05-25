import {ChatCompletion, ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import {ChatCompletionMessage} from 'openai/resources/chat';
import OpenAI from 'openai';
import GptEntity from '../../Core/Gpt/GptEntity';
import GptBackend from '../../Core/Gpt/GptBackend';

export default class OpenAiSdk implements GptBackend {
    constructor(
        private openai: OpenAI
    ) {
    }

    public async runChatCompletion(messages: Array<ChatCompletionMessageParam>): Promise<GptEntity> {
        const response: ChatCompletion = await this.openai.chat.completions.create({
            stream: false,
            model: 'gpt-4o',
            max_tokens: 256,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 0.8,
            top_p: 1,
            messages: messages
        });
        return this.parseResult(response);
    }

    public async translate(language: string, data: Json): Promise<Json> {
        const messages: Array<ChatCompletionMessageParam> = [
            {
                role: 'system',
                content: `Translate the following content to ${language} language. 
                    It is extrem important to keep the JSON structure and to translate only the values.
                    The JSON structure must be identical to the user input.
                `
            },
            {
                role: 'user',
                content: JSON.stringify(data)
            }
        ];

        const response: ChatCompletion = await this.openai.chat.completions.create({
            stream: false,
            model: 'gpt-4o',
            max_tokens: 2047,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 0.3,
            top_p: 1,
            messages: messages
        });

        return this.parseTranslation(response, data);
    }

    private parseResult(response: ChatCompletion): GptEntity {
        const gptMessage: ChatCompletionMessage = response.choices[0]?.message;
        console.log('GPT-Dump:', gptMessage);
        const data: Json = this.parseGeneratedData(gptMessage);
        const result: GptEntity = new GptEntity();

        result.say = String(data.content || '');
        result.commands = (data.commands || []).map((x: any) => String(x));
        result.role = gptMessage.role;
        result.language = data.language || 'de-DE';

        return result;
    }

    private parseTranslation(response: ChatCompletion, data: Json): Json {
        const gptMessage: ChatCompletionMessage = response.choices[0]?.message;
        console.log('Translation GPT-Dump:', gptMessage);
        try {
            return JSON.parse(String(gptMessage.content));
        } catch (error) {
            console.warn('Translation JSON-GPT-Decode-Error:', error);
            return data;
        }
    }

    private parseGeneratedData(gptMessage: ChatCompletionMessage): Json {
        let data: Json = {};
        try {
            data = JSON.parse(gptMessage?.content || '');
        } catch (parseError) {
            console.warn('JSON-GPT-Decode-Error:', parseError);
            return this.checkForSingleText(gptMessage);
        }
        return data;
    }

    private checkForSingleText(gptMessage: ChatCompletionMessage): Json {
        const messageContent: string = gptMessage?.content || '';
        if (messageContent.indexOf('{') > -1) {
            console.error('GPT-Message not parsable.');
            return {};
        }

        console.log('Use message as plain text');

        return {
            say: messageContent,
            command: '',
            language: ''
        };
    }
}
