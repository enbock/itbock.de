import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default interface Response {
    isLoading: boolean;
    audioInputEnabled: boolean;
    audioOutput: AudioBuffer;
    isPlaying: boolean;
}
