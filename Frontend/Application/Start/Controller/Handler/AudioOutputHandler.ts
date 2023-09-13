import Adapter from 'Application/Start/Adapter';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import ControllerHandler from 'Application/ControllerHandler';

export default class AudioOutputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private startUseCase: StartUseCase
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.audioFinished = () => this.handleFinishing();
    }

    private async handleFinishing(): Promise<void> {
        this.startUseCase.endPlayback();
        await this.presentData();
    }
}
