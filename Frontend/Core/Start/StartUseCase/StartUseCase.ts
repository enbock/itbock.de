import StartStorage from 'Core/Start/StartStorage';
import Response from 'Core/Start/StartUseCase/Response';
import Modules from 'Core/Start/Modules';
import AudioFeedbackClient, {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';

export default class StartUseCase {
    constructor(
        private startStorage: StartStorage,
        private audioFeedbackClient: AudioFeedbackClient
    ) {
    }

    public async startApplication(): Promise<void> {
        void this.audioFeedbackClient.play(FEEDBACK.SCREEN_ON);
        this.startStorage.setModuleName(Modules.CONVERSATION);
    }

    public getState(response: Response): void {
        response.module = this.startStorage.getModuleName();
        response.language = this.startStorage.getLanguage();
    }

    public initialize(defaultLanguage: string): void {
        this.startStorage.setModuleName(Modules.START_SCREEN);
        this.startStorage.setLanguage(defaultLanguage);
    }
}
