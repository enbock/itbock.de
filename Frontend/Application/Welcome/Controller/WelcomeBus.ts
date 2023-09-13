export default class WelcomeBus {
    public newInput: AdapterCallback<(text: string) => Promise<void>> = () => <never>false;
}
