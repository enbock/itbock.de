import {AudioBuffer} from 'Core/Audio/AudioStorage';
import Response from 'Core/Audio/StateUseCase/Response';

export default class AudioStateResponse implements Response {
    public microphoneEnable: boolean = false;
    public isLoading: boolean = false;
    public audioInputEnabled: boolean = false;
    public audioOutput: AudioBuffer = {audio: '', text: ''};
    public isPlaying: boolean = false;
}
