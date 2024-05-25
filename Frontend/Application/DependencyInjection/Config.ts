export default class Config {
    public transformUrl: string = String(process.env.API_AUDIO_TRANSFORM_URL || '');
    public gptClientUrl: string = String(process.env.API_GPT_CLIENT_URL || '');
    public wakeupWords: Array<string> = [
        'computer',
        'terminal'
    ];
    public useFakeApi: boolean = String(process.env.FAKE || '') == 'true';
}
