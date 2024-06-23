import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions';
import GeneralGptSceneSetup from './GeneralGptSceneSetup';
import GptEntity from '../GptEntity';
import GptBackend from '../GptBackend';
import AudioSyntheseClient from '../../AudioSyntheseClient';
import Command from '../Command/Command';

export default class GptUseCase {
    constructor(
        private backend: GptBackend,
        private audioSyntheseClient: AudioSyntheseClient,
        private commands: Array<Command>
    ) {
    }

    async execute(pastConversation: Array<ChatCompletionMessageParam>): Promise<GptEntity> {
        const scene: Array<ChatCompletionMessageParam> = GeneralGptSceneSetup;

        const result: GptEntity = await this.backend.runChatCompletion([
            ...scene,
            ...pastConversation
        ]);

        for (const command of this.commands) {
            if (command.supports(result) == false) continue;
            await command.execute(result);
        }

        result.audio = await this.audioSyntheseClient.speech(result.say);

        return result;
    }
}
