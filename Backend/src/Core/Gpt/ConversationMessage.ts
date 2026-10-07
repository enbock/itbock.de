import {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import {Role} from './GptEntity';

export interface ConversationMessagePayload {
    language: string;
    content: string;
}

export default class ConversationMessage {
    public static create(
        role: Role,
        content: string,
        language: string
    ): ChatCompletionMessageParam {
        return {
            role,
            content: JSON.stringify({
                language,
                content
            })
        } as ChatCompletionMessageParam;
    }

    public static parse(message: ChatCompletionMessageParam): ConversationMessagePayload | null {
        if (typeof message.content !== 'string') {
            return null;
        }

        try {
            const data: Json = JSON.parse(message.content);

            return {
                language: typeof data?.language === 'string' && data.language.trim() ? data.language : 'de-DE',
                content: typeof data?.content === 'string' ? data.content : ''
            };
        } catch {
            return {
                language: 'de-DE',
                content: message.content
            };
        }
    }
}
