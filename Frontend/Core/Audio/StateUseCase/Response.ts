import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default interface Response {
    microphoneEnable: boolean;
    isLoading: boolean;
    audioInputEnabled: boolean;
    audioOutput: AudioBuffer;
    isPlaying: boolean;
}
