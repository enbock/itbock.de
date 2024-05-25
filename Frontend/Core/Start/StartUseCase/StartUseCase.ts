import StartStorage from 'Core/Start/StartStorage';
import Response from 'Core/Start/StartUseCase/Response';
import Modules from 'Core/Start/Modules';

export default class StartUseCase {
    constructor(
        private startStorage: StartStorage
    ) {
    }

    public startApplication(): void {
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
