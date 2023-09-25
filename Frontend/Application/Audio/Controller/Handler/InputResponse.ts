import FinishedInputResponse from 'Core/Audio/InputUseCase/FinishedInputResponse';
import Channel from 'Core/Audio/InputUseCase/Channel';

export default class InputResponse implements FinishedInputResponse {
    public channel: Channel = Channel.NONE;
}
