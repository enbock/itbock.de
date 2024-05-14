import {ChatCompletionRole} from 'openai/src/resources/chat/completions';

export type Role = ChatCompletionRole;

export default class GptEntity {
    public commands: Array<string> = [];
    public say: string = '';
    public role: Role = 'user';
    public language: string = 'de_DE';
}
