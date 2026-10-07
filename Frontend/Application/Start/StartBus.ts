export default class StartBus {
    public receiveText: Callback<(text: string) => Promise<void>> = () => <never>false;
}
