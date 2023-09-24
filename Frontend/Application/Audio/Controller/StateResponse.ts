import Response from 'Core/Audio/StateUseCase/Response';

export default class StateResponse implements Response {
    public audioInputEnabled: boolean = false;
    public textOutput: string = '';
    public isLoading: boolean = false;
    public isPlaying: boolean = false;
}
