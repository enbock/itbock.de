import {ChatCompletionRole} from 'openai/resources/chat/completions';
import Modules from '../Start/Modules';
import GptPage from './GptPage';

export type Role = ChatCompletionRole;

export default class GptEntity {
    public commands: Array<string> = [];
    public internalCommands: Array<string> = [];
    public say: string = '';
    public role: Role = 'user';
    public language: string = 'de-DE';
    public audio: string = '';
    public data: Json = {};
    public page: GptPage | null = null;
    public module: Modules = 'START_SCREEN';
    public version: number = 0;
}
