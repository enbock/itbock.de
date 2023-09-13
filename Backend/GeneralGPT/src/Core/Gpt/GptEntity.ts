import {ChatCompletionRole} from 'openai/src/resources/chat/completions';

export type Role = ChatCompletionRole;

export default class GptEntity {
    public command: string = '';
    public say: string = '';
    public role: Role = 'user';
}