import Response from 'Core/Welcome/StateUseCase/Response';
import StateStorage from 'Core/Welcome/StateStorage';

export default class StateUseCase {
    constructor(
        private stateStorage: StateStorage
    ) {
    }

    public getState(response: Response): void {
        response.linksShown = this.stateStorage.getShowLinks();
    }
}
