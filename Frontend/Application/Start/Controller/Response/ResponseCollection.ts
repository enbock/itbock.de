import GptStateResponse from 'Application/Start/Controller/Response/GptStateResponse';
import AudioStateResponse from 'Application/Start/Controller/Response/AudioStateResponse';
import StartStateResponse from 'Application/Start/Controller/Response/StartStateResponse';
import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';

export default class ResponseCollection {
    public i18n: JsonData = {};
    public gptState: GptStateResponse = new GptStateResponse();
    public audioState: AudioStateResponse = new AudioStateResponse();
    public startState: StartStateResponse = new StartStateResponse();
    public replication: StartReplicationEntity = new StartReplicationEntity();
}
