export enum AudioFeedback {
    COMPUTER_BEEP,
    SCREEN_ON,
    SCREEN_OFF
}

export default interface AudioFeedbackClient {
    play(feedback: AudioFeedback): Promise<void>;
}
