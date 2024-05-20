export default interface AudioTransformClient {
    transcribe(fileBuffer: Buffer): Promise<string>;
}
