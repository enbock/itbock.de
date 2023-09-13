export default class Adapter {
    public closeStart: AdapterCallback = () => <never>undefined;
    public speechInput: AdapterCallback<(text: string) => Promise<void>> = () => <never>undefined;
    public audioFinished: AdapterCallback = () => <never>undefined;
}
