import StateResponse from 'Application/Audio/Controller/StateResponse';
import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default class AudioStateResponse implements StateResponse {
    public audioInputEnabled: boolean = false;
    public isLoading: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isPlaying: boolean = false;
    public language: string = '';
}
