import StartStorage from "Core/Start/StartStorage";
import AudioService from "Core/Audio/AudioService";
import Response from "Core/Start/StartUseCase/Response";

export default class StartUseCase {
    constructor(
        private startStorage: StartStorage,
        private audioService: AudioService
    ) {
    }

    public startApplication(): void {
        this.startStorage.setStarted(true);
    }

    public getState(response: Response): void {
        const hasStarted: boolean = this.startStorage.getStarted();

        response.hasStarted = hasStarted;
        if (hasStarted) response.text = this.audioService.getAudioText();
    }

    public initialize(): void {
        this.startStorage.setStarted(false);
    }
}
