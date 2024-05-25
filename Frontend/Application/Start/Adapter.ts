export default class Adapter {
    public audioFinished: Callback = () => <never>undefined;
    public audioLoaded: Callback = () => <never>undefined;
    public audioBlobInput: Callback<(audioBase64: string) => Promise<void>> = () => <never>undefined;
    public audioAbort: Callback = () => <never>undefined;
    public start: Callback = () => <never>undefined;
}
