export default interface AudioSyntheseClient {
    speech(inputText: string): Promise<string>;
}
