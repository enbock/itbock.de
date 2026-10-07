import {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import ParseHelper from '../../ParseHelper';
import ConversationMessage from '../../Core/Gpt/ConversationMessage';
import {Role} from '../../Core/Gpt/GptEntity';

export default class BodyParser {
    constructor(
        private parseHelper: ParseHelper
    ) {
    }

    public parseBody(body: string): Array<ChatCompletionMessageParam> {
        try {
            const data: Json = JSON.parse(body);
            const conversation: Array<Json> = this.parseHelper.get<Array<Json>>(data, 'messages', []) || [];
            return conversation.map(x => this.parse(x));
        } catch (error) {
            return [];
        }
    }

    private parse(data: Json): ChatCompletionMessageParam {
        return ConversationMessage.create(
            String(this.parseHelper.get<Role>(data, 'role', 'user') || '') as Role,
            String(this.parseHelper.get<string>(data, 'content', '') || ''),
            String(this.parseHelper.get<string>(data, 'language', '') || 'de-DE')
        );
    }
}
