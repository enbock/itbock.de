export default interface AudioTransformClient {
    transcribeAudio(audioBase64: string): Promise<string>;
}
