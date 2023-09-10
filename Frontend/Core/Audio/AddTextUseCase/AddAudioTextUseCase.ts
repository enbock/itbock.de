import Request from 'Core/Audio/AddTextUseCase/Request';
import AudioService from 'Core/Audio/AudioService';

export default class AddAudioTextUseCase {
    constructor(
        private audioService: AudioService
    ) {
    }

    public addText(request: Request): void {
        this.audioService.addAudioText(request.text);
    }
}
