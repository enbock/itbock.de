import StateResponse from 'Application/Audio/Controller/StateResponse';
import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default class AudioStateResponse implements StateResponse {
    public microphoneEnable: boolean = false;
    public language: string = '';
    public isLoading: boolean = false;
    public audioInputEnabled: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isPlaying: boolean = false;
}
