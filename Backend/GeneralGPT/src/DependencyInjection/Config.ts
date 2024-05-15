export default class Config {
    public openAiApiKey: string = String(process.env.OPENAI_API_KEY || '');
}
