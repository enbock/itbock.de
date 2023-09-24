import StateStorage from 'Core/Welcome/StateStorage';

export default class OldHomepageUseCase {
    constructor(
        private stateStorage: StateStorage
    ) {
    }

    public initialize(): void {
        this.stateStorage.setShowLinks(false);
    }

    public showLinkToHomepage(): void {
        this.stateStorage.setShowLinks(true);
    }
}
