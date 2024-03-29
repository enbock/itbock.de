import {ChatCompletion, ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import GptEntity from '../../Core/Gpt/GptEntity';
import {ChatCompletionMessage} from 'openai/resources/chat';
import OpenAI from 'openai';
import GptBackend from '../../Core/Gpt/GptBackend';

export default class Network implements GptBackend {
    constructor(
        private openai: OpenAI
    ) {
    }

    public async runChatCompletion(messages: Array<ChatCompletionMessageParam>): Promise<GptEntity> {
        const response: ChatCompletion = await this.openai.chat.completions.create({
            stream: false,
            model: 'gpt-4',
            max_tokens: 256,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 1,
            top_p: 1,
            messages: messages
        });
        console.log('GPT-Result:', response.choices);
        return this.parseResult(response);
    }

    private parseResult(response: ChatCompletion): GptEntity {
        const gptMessage: ChatCompletionMessage = response.choices[0]?.message;
        const data: Json = this.parseGeneratedData(gptMessage);
        const result: GptEntity = new GptEntity();

        result.say = String(data.say || '');
        result.commands = (data.commands || []).map(x => String(x));
        result.role = gptMessage.role;

        return result;
    }

    private parseGeneratedData(gptMessage: ChatCompletionMessage): Json {
        let data: Json = {};
        try {
            data = JSON.parse(gptMessage?.content);
        } catch (parseError) {
            console.warn('JSON-GPT-Decode-Error:', parseError);
            return this.checkForSingleText(gptMessage);
        }
        return data;
    }

    private checkForSingleText(gptMessage: ChatCompletionMessage): Json {
        const messageContent: string = gptMessage?.content;
        if (messageContent.indexOf('{') > -1) {
            console.error('GPT-Message not parsable.');
            return {};
        }

        console.log('Use message as plain text');

        return {
            say: messageContent,
            command: ''
        };
    }
}
