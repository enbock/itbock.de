import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import GeneralGptSceneSetup from './GeneralGptSceneSetup';
import GptEntity from '../GptEntity';
import GptBackend from '../GptBackend';
import AudioSyntheseClient from '../../AudioSyntheseClient';


export default class GptUseCase {
    constructor(
        private backend: GptBackend,
        private audioSyntheseClient: AudioSyntheseClient
    ) {
    }

    async execute(pastConversation: Array<ChatCompletionMessageParam>): Promise<GptEntity> {
        const scene: Array<ChatCompletionMessageParam> = GeneralGptSceneSetup;

        const result: GptEntity = await this.backend.runChatCompletion([
            ...scene,
            ...pastConversation
        ]);
        result.audio = await this.audioSyntheseClient.speech(result.say);

        return result;
    }
}
