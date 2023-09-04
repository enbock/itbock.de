import AudioStorage from "Core/Audio/AudioStorage";

export default class Memory implements AudioStorage {
    private buffer: Array<string> = [];

    public getBuffer(): Array<string> {
        return this.buffer;
    }

    public setBuffer(buffer: Array<string>): void {
        this.buffer = buffer;
    }
}