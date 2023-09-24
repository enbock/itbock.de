export default interface StateStorage {
    getShowLinks(): boolean;

    setShowLinks(show: boolean): void;
}
