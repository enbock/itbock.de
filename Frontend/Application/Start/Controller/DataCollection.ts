import GptStateResponse from 'Application/Start/Controller/Response/GptStateResponse';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';
import AudioStateResponse from 'Application/Start/Controller/Response/AudioStateResponse';

export default class DataCollection {
    public gptState: GptStateResponse = new GptStateResponse();
    public startState: StartStateResponse = new StartStateResponse();
    public audioState: AudioStateResponse = new AudioStateResponse();
}
