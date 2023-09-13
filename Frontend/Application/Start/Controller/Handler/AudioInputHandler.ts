import ControllerHandler from 'Application/ControllerHandler';
import Adapter from 'Application/Start/Adapter';
import WelcomeBus from 'Application/Welcome/Controller/WelcomeBus';

export default class AudioInputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private bus: WelcomeBus
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.speechInput = (text: string) => this.handleInput(text);
    }

    private async handleInput(text: string): Promise<void> {
        await this.bus.newInput(text);
    }
}
