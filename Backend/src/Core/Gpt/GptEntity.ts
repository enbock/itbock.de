import {ChatCompletionRole} from 'openai/src/resources/chat/completions';

export type Role = ChatCompletionRole;

export default class GptEntity {
    public commands: Array<string> = [];
    public internalCommands: Array<string> = [];
    public say: string = '';
    public role: Role = 'user';
    public language: string = 'de-DE';
    public audio: string = '';
    public data: Json = {};
}
