import AudioTransformClient from './AudioTransformClient';

export default class AudioTransformUseCase {
    constructor(private audioTransformClient: AudioTransformClient) {}

    public async execute(fileBuffer: Buffer): Promise<string> {
        return await this.audioTransformClient.transcribe(fileBuffer);
    }
}

