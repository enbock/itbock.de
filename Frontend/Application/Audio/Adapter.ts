export default class Adapter {
    public audioFinished: AdapterCallback = () => <never>undefined;
    public audioLoaded: AdapterCallback = () => <never>undefined;
    public audioBlobInput: AdapterCallback<(audioBlob: Blob) => Promise<void>> = () => <never>undefined;
    public audioAbort: AdapterCallback = () => <never>undefined;
}
