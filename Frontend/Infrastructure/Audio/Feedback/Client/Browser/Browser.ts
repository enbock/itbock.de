import AudioFeedbackClient, {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';

export default class Browser implements AudioFeedbackClient {
    private audio: HTMLAudioElement = new Audio();

    constructor(
        private sounds: Record<FEEDBACK, Array<string>>,
        body: HTMLElement
    ) {
        body.appendChild(this.audio);
    }

    public async play(feedback: FEEDBACK): Promise<void> {
        const soundList: Array<string> = this.sounds[feedback];
        const index: number = soundList.length > 1 ? Math.round((soundList.length - 1) * Math.random()) : 0;

        this.audio.src = soundList[index];
        await this.audio.play();
    }
}
