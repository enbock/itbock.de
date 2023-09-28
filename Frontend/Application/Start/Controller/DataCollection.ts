import GptStateResponse from 'Application/Start/Controller/Response/GptStateResponse';
import AudioStateResponse from 'Application/Start/Controller/Response/AudioStateResponse';

export default class DataCollection {
    public gptState: GptStateResponse = new GptStateResponse();
    public audioState: AudioStateResponse = new AudioStateResponse();
}
