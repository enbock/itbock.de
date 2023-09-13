import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import GeneralGptSceneSetup from './GeneralGptSceneSetup';
import GptEntity from './GptEntity';
import GptBackend from './GptBackend';


export default class GptUseCase {
    constructor(
        private backend: GptBackend
    ) {
    }

    async execute(pastConversation: Array<ChatCompletionMessageParam>): Promise<GptEntity> {
        const scene: Array<ChatCompletionMessageParam> = GeneralGptSceneSetup;
        const gpt: GptEntity = await this.backend.runChatCompletion([
            ...scene,
            ...pastConversation
        ]);

        if (!gpt.say) gpt.say = 'Willkommen bei Bock Laboratories.';

        return gpt;
    }
}