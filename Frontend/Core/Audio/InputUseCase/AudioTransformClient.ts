export default interface AudioTransformClient {
    transcribeAudio(audioBlob: Blob): Promise<string>;
}
