import AudioModel from 'Application/Audio/View/AudioModel';
import AudioInputModel from 'Application/Audio/Input/InputModel';
import StateResponse from 'Application/Start/Controller/StateResponse';

export default class StartModel {
    public audio: AudioModel = new AudioModel();
    public showStart: boolean = true;
    public audioInput: AudioInputModel = new AudioInputModel();
    public bypass: StateResponse = new StateResponse();
}
