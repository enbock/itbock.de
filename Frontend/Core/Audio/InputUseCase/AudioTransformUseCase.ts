import AudioTransformClient from 'Core/Audio/InputUseCase/AudioTransformClient';

export default class AudioTransformUseCase {
    constructor(
        private audioTransformClient: AudioTransformClient
    ) {
    }

    public async transcribeAudio(audioBase64: string): Promise<string> {
        return await this.audioTransformClient.transcribeAudio(audioBase64);
    }
}
