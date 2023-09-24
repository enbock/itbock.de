import ControllerHandler from 'Application/ControllerHandler';
import WelcomeBus from 'Application/Welcome/Controller/WelcomeBus';
import Adapter from 'Application/Audio/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class AudioInputHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private welcomeBus: WelcomeBus,
        private inputUseCase: InputUseCase
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.speechInput = (text: string) => this.handleInput(text);
    }

    private presentData: Callback = () => <never>false;

    private async handleInput(text: string): Promise<void> {
        this.inputUseCase.inputFinished();
        await this.welcomeBus.newInput(text); // TODO Rotate dependency ... listener register
        await this.presentData();
    }
}
