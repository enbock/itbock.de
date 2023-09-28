import GptStateResponse from 'Application/Start/Controller/Response/GptStateResponse';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';
import AudioStateResponse from 'Application/Start/Controller/Response/AudioStateResponse';
import StateResponse from 'Application/Welcome/Controller/StateResponse';

export default class DataCollection {
    public gptState: GptStateResponse = new GptStateResponse();
    public startState: StartStateResponse = new StartStateResponse();
    public audioState: AudioStateResponse = new AudioStateResponse();
    public welcomeState: StateResponse = new StateResponse();
}
