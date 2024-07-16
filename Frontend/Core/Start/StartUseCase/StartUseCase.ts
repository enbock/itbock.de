import StartStorage from 'Core/Start/StartStorage';
import Response from 'Core/Start/StartUseCase/Response';
import AudioFeedbackClient, {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';

export default class StartUseCase {
    constructor(
        private startStorage: StartStorage,
        private audioFeedbackClient: AudioFeedbackClient
    ) {
    }

    public async startApplication(): Promise<void> {
        void this.audioFeedbackClient.play(FEEDBACK.SCREEN_ON);
    }

    public getState(response: Response): void {
        response.language = this.startStorage.getLanguage();
    }

    public initialize(defaultLanguage: string): void {
        this.startStorage.setLanguage(defaultLanguage);
    }
}
