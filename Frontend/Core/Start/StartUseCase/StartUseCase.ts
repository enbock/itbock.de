import StartStorage from 'Core/Start/StartStorage';
import Response from 'Core/Start/StartUseCase/Response';

export default class StartUseCase {
    constructor(
        private startStorage: StartStorage
    ) {
    }

    public startApplication(): void {
        this.startStorage.setApplicationStarted(true);
    }

    public getState(response: Response): void {
        response.applicationStarted = this.startStorage.getApplicationStarted();
    }

    public initialize(defaultLanguage: string): void {
        this.startStorage.setApplicationStarted(false);
        this.startStorage.setLanguage(defaultLanguage);
    }
}
