import OpenAI from 'openai';
import EmbeddingClient from '../../Core/Rag/EmbeddingClient';

export default class OpenAiEmbeddingClient implements EmbeddingClient {
    public static readonly MODEL: string = 'text-embedding-3-small';

    constructor(
        private openai: OpenAI
    ) {
    }

    public async embed(texts: Array<string>): Promise<Array<Array<number>>> {
        if (texts.length === 0) {
            return [];
        }

        const response = await this.openai.embeddings.create({
            model: OpenAiEmbeddingClient.MODEL,
            input: texts
        });

        return response.data
            .sort((left, right): number => left.index - right.index)
            .map((entry): Array<number> => entry.embedding);
    }
}
