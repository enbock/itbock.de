import StartResponse from 'Core/Start/StartUseCase/Response';
import {AudioBuffer} from 'Core/Audio/AudioStorage';
import AudioResponse from 'Core/Audio/StateUseCase/Response';


export default class StartStateResponse implements StartResponse, AudioResponse {
    public microphoneEnable: boolean = false;
    public language: string = '';
    public audioInputEnabled: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isAudioLoading: boolean = false;
    public isAudioPlaying: boolean = false;
}
