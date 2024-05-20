import AudioTransformClient from '../../Core/Audio/AudioTransformClient';
import {Audio} from 'openai/resources';
import OpenAI from 'openai';
import Transcription = Audio.Transcription;

export default class OpenAiAudioTransform implements AudioTransformClient {
    constructor(
        private openAi: OpenAI
    ) {
    }

    public async transcribe(audioBuffer: Buffer): Promise<string> {
        const file: File = new File([audioBuffer], 'audio.wav', {type: 'audio/wav'});

        try {
            const response: Transcription = await this.openAi.audio.transcriptions.create({
                file: file,
                model: 'whisper-1',
                response_format: 'json',
                temperature: 0
            });
            return response.text;
        } catch (error) {
            console.log('Transcription-Error:', error);
            return '';
        }
    }
}
