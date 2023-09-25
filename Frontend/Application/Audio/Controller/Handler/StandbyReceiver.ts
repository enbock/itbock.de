import AudioInputReceiverHandler from 'Application/Audio/Controller/Handler/AudioInputReceiverHandler';
import Channel from 'Core/Audio/InputUseCase/Channel';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class StandbyReceiver implements AudioInputReceiverHandler {
    constructor(
        private inputUseCase: InputUseCase
    ) {
    }

    public support(channel: Channel): boolean {
        return channel == Channel.NONE;
    }

    public async receiveText(text: string): Promise<void> {
        this.inputUseCase.startInput();
    }
}
