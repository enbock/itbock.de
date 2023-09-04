import AudioStorage from "Core/Audio/AudioStorage";

export default class AudioService {
    constructor(
        private audioStorage: AudioStorage
    ) {
    }

    public getAudioText(): string {
        const text: string = this.audioStorage.getBuffer().join(" ");
        this.audioStorage.setBuffer([]);

        return text;
    }
}
