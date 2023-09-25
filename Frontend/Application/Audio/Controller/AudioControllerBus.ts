export default class AudioControllerBus {
    public refresh: BusCallback = () => <never>false;
    public suspend: BusCallback = () => <never>false;
}
