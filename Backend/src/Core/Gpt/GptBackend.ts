import {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import GptEntity from './GptEntity';

export default interface GptBackend {
    runChatCompletion(scene: Array<ChatCompletionMessageParam>): Promise<GptEntity>;

    translate(language: string, data: Json): Promise<Json>;
}
