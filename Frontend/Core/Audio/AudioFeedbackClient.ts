export enum FEEDBACK {
    COMPUTER_BEEP,
    SCREEN_ON,
    SCREEN_OFF
}

export default interface AudioFeedbackClient {
    play(feedback: FEEDBACK): Promise<void>;
}
