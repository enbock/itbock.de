import {AudioBuffer} from 'Core/Audio/AudioStorage';

export default interface Response {
    microphoneEnable: boolean;
    isAudioLoading: boolean;
    audioInputEnabled: boolean;
    audioOutput: AudioBuffer;
    isAudioPlaying: boolean;
}
