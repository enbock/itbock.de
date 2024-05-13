import Response from 'Core/Audio/StateUseCase/Response';
import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default class StateResponse implements Response {
    public audioInputEnabled: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isLoading: boolean = false;
    public isPlaying: boolean = false;
}
