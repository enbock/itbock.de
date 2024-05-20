import AudioTransformClient from 'Core/Audio/InputUseCase/AudioTransformClient';

export default class AudioTransformUseCase {
    constructor(
        private audioTransformClient: AudioTransformClient
    ) {
    }

    public async transcribeAudio(audioBlob: Blob): Promise<string> {
        return await this.audioTransformClient.transcribeAudio(audioBlob);
    }
}
