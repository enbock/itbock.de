import Response from 'Core/Audio/StateUseCase/Response';
import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default class StateResponse implements Response {
    public microphoneEnable: boolean = false;
    public language: string = '';
    public isLoading: boolean = false;
    public audioInputEnabled: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isPlaying: boolean = false;
}
