export default interface AudioStorage {
    getBuffer(): Array<string>;

    setBuffer(buffer: Array<string>): void;

    setPlaying(playing: boolean): void;

    getPlaying(): boolean;
}
