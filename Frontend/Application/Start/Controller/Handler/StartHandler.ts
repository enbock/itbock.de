import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class StartHandler implements ControllerHandler {
    constructor(
        private startControllerBus: StartControllerBus,
        private startUseCase: StartUseCase,
        private audioControllerBus: AudioControllerBus,
        private inputUseCase: InputUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.startControllerBus.start = () => this.handleStart();
    }

    private presentData: Callback = () => <never>false;

    private async handleStart(): Promise<void> {
        this.startUseCase.startApplication();
        this.inputUseCase.initialize();
        await this.audioControllerBus.refresh();
        await this.presentData();
    }
}
