import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default interface Response {
    language: string;
    isLoading: boolean;
    audioInputEnabled: boolean;
    audioOutput: AudioBuffer;
    isPlaying: boolean;
}
