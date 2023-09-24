import StateResponse from 'Application/Audio/Controller/StateResponse';

export default class AudioStateResponse implements StateResponse {
    public audioInputEnabled: boolean = false;
    public isLoading: boolean = false;
    public textOutput: string = '';
}
