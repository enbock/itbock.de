import Response from 'Core/Start/StartUseCase/Response';

export default class StartStateResponse implements Response {
    public applicationStarted: boolean = false;
    public showLinks: boolean = false;
}
