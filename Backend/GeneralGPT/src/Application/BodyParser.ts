import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import ParseHelper from '../ParseHelper';
import {Role} from '../Core/Gpt/GptEntity';

export default class BodyParser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parseBody(body: string): Array<ChatCompletionMessageParam> {
        try {
            const data: Json = JSON.parse(body);
            const conversation: Array<Json> = this.parseHelper.get<Array<Json> | undefined>(data, 'messages', []) || [];
            return conversation.map(x => this.parse(x));
        } catch (error) {

        }
        return [];
    }

    private parse(data: Json): ChatCompletionMessageParam {
        return {
            role: String(this.parseHelper.get<Role>(data, 'role', 'user') || '') as Role,
            content: JSON.stringify({
                language: String(this.parseHelper.get<string>(data, 'language', '') || 'de-DE'),
                content: String(this.parseHelper.get<string>(data, 'content', '') || '')
            })
        };
    }
}
