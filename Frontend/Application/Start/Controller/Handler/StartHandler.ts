import ControllerHandler from 'Application/ControllerHandler';
import Adapter from 'Application/Start/Adapter';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';

export default class StartHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private startUseCase: StartUseCase,
        private audioControllerBus: AudioControllerBus
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.closeStart = () => this.handleStart();
    }

    private presentData: Callback = () => <never>false;

    private async handleStart(): Promise<void> {
        this.startUseCase.startApplication();
        await this.presentData();
        await this.audioControllerBus.refresh();
    }
}
