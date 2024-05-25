import GptStateResponse from 'Application/Start/Controller/Response/GptStateResponse';
import AudioStateResponse from 'Application/Start/Controller/Response/AudioStateResponse';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';

export default class ResponseCollection {
    public i18n: Json = {};
    public gptState: GptStateResponse = new GptStateResponse();
    public audioState: AudioStateResponse = new AudioStateResponse();
    public startState: StartStateResponse = new StartStateResponse();
}
