import StartResponse from 'Core/Start/StartUseCase/Response';
import {AudioBuffer} from 'Core/Audio/AudioStorage';
import AudioResponse from 'Core/Audio/StateUseCase/Response';
import Modules from 'Core/Start/Modules';


export default class StartStateResponse implements StartResponse, AudioResponse {
    public microphoneEnable: boolean = false;
    public language: string = '';
    public isLoading: boolean = false;
    public audioInputEnabled: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isPlaying: boolean = false;
    public module: Modules = Modules.START_SCREEN;
}
