import Request from "Core/Audio/AddTextUseCase/Request";
import AudioStorage from "Core/Audio/AudioStorage";

export default class AddAudioTextUseCase {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public addText(request: Request): void {
        const buffer: Array<string> = this.audioStorage.getBuffer();
        buffer.push(request.text);
        this.audioStorage.setBuffer(buffer);
    }
}
