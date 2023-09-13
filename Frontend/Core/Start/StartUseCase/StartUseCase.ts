import StartStorage from 'Core/Start/StartStorage';
import AudioService from 'Core/Audio/AudioService';
import Response from 'Core/Start/StartUseCase/Response';
import AudioStorage from 'Core/Audio/AudioStorage';

export default class StartUseCase {
    constructor(
        private startStorage: StartStorage,
        private audioService: AudioService,
        private audioStorage: AudioStorage
    ) {
    }

    public startApplication(): void {
        this.startStorage.setApplicationStarted(true);
    }

    public getState(response: Response): void {
        const hasStarted: boolean = this.startStorage.getApplicationStarted();

        response.applicationStarted = hasStarted;
        response.muted = this.startStorage.getMicrophoneMuted();
        response.showLinks = this.startStorage.getShowLinks(); // TODO, das muß woanders hin

        this.takeAudioText(hasStarted, response);
    }

    private takeAudioText(hasStarted: boolean, response: Response): void {
        if (hasStarted == false) return;
        response.text = this.audioService.getAudioText();
        response.isPlaying = this.audioStorage.getPlaying();
    }

    public initialize(): void {
        this.startStorage.setApplicationStarted(false);
    }

    public endPlayback(): void {
        this.audioStorage.setPlaying(false);
    }
}
