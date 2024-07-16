export default class Config {
    public replicationPollTime: number = 1000;
    public transformUrl: string = String(process.env.API_AUDIO_TRANSFORM_URL || '');
    public gptClientUrl: string = String(process.env.API_GPT_CLIENT_URL || '');
    public translationServiceUrl: string = String(process.env.API_TRANSLATION_SERVICE_URL || '');
    public wakeupWords: Array<string> = [
        'computer',
        'terminal'
    ];
    public useFakeApi: boolean = String(process.env.FAKE || '') == 'true';
    public replicationUrlStart: string = String(process.env.REPLICATION_URL_START || '');
}
