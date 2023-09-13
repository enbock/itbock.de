import Response from 'Core/Start/StartUseCase/Response';

export default class StateResponse implements Response {
    public text: string = '';
    public applicationStarted: boolean = false;
    public isPlaying: boolean = false;
    public muted: boolean = false;
    public showLinks: boolean = false;
}
