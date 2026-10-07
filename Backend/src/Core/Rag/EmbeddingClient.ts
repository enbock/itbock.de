export default interface EmbeddingClient {
    embed(texts: Array<string>): Promise<Array<Array<number>>>;
}
