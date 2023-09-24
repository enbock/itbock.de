export default class Adapter {
    public speechInput: AdapterCallback<(text: string) => Promise<void>> = () => <never>undefined;
    public audioFinished: AdapterCallback = () => <never>undefined;
    public audioLoaded: AdapterCallback = () => <never>undefined;
}
