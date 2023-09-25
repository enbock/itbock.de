import ControllerHandler from 'Application/ControllerHandler';
import Adapter from 'Application/Audio/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioInputReceiverHandler from 'Application/Audio/Controller/Handler/AudioInputReceiverHandler';
import InputResponse from 'Application/Audio/Controller/Handler/InputResponse';

export default class AudioInputHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private inputUseCase: InputUseCase,
        private receivers: Array<AudioInputReceiverHandler>
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.speechInput = (text: string) => this.handleInput(text);
    }

    private presentData: Callback = () => <never>false;

    private async handleInput(text: string): Promise<void> {
        const response: InputResponse = new InputResponse();
        this.inputUseCase.inputFinished({text: text}, response);

        for (const receiver of this.receivers) {
            if (receiver.support(response.channel) == false) continue;

            await receiver.receiveText(text);
            break;
        }

        await this.presentData();
    }
}
