import AudioTransformClient from '../../Core/Audio/AudioTransformClient';
import type {Audio} from 'openai/resources';
import OpenAI from 'openai';

export default class OpenAiAudioTransform implements AudioTransformClient {
    constructor(
        private openAi: OpenAI
    ) {
    }

    public async transcribe(audioBuffer: Buffer): Promise<string> {
        const file: File = new File([new Uint8Array(audioBuffer)], 'audio.wav', {type: 'audio/wav'});

        try {
            const response: Audio.Transcription = await this.openAi.audio.transcriptions.create({
                file: file,
                model: 'whisper-1',
                response_format: 'json',
                temperature: 0.1
            });

            return response.text;
        } catch (error) {
            console.log('Transcription-Error:', error);
            return '';
        }
    }
}
