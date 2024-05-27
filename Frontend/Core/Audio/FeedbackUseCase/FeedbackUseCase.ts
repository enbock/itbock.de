import AudioFeedbackClient, {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';

export default class FeedbackUseCase {
    constructor(
        private audioFeedbackClient: AudioFeedbackClient
    ) {
    }

    public async beep(): Promise<void> {
        void this.audioFeedbackClient.play(FEEDBACK.COMPUTER_BEEP);
    }
}
