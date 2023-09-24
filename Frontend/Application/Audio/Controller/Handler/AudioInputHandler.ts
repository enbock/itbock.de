import ControllerHandler from 'Application/ControllerHandler';
import WelcomeBus from 'Application/Welcome/Controller/WelcomeBus';
import Adapter from 'Application/Audio/Adapter';

export default class AudioInputHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private welcomeBus: WelcomeBus
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.speechInput = (text: string) => this.handleInput(text);
    }

    private presentData: Callback = () => <never>false;

    private async handleInput(text: string): Promise<void> {
        await this.welcomeBus.newInput(text);
        await this.presentData();
    }
}
