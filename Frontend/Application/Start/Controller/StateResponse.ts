import Response from 'Core/Start/StartUseCase/Response';

export default class StateResponse implements Response {
    public applicationStarted: boolean = false;
    public showLinks: boolean = false;
}
