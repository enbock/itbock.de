import {AudioBuffer} from 'Core/Audio/AudioStorage';
import Adapter from 'Application/Start/Adapter';

export default class AudioOutputDevice {
    private audioElement: HTMLAudioElement;
    private currentPlaying: AudioBuffer = {audio: '', text: ''};

    constructor(
        private adapter: Adapter
    ) {
        this.audioElement = new Audio();
        this.audioElement.addEventListener('ended', () => this.playbackFinished());
    }

    public async playAudio(buffer: AudioBuffer): Promise<void> {
        if (this.currentPlaying.audio == buffer.audio && this.currentPlaying.text == buffer.text) return;
        if (buffer.audio == '' || buffer.text == '') return;

        this.currentPlaying = buffer;

        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = `data:audio/wav;base64,${buffer.audio}`;
        void this.audioElement.play();
    }

    private playbackFinished(): void {
        this.currentPlaying = {audio: '', text: ''};
        void this.adapter.audioFinished();
    }
}
