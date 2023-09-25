import Channel from 'Core/Audio/InputUseCase/Channel';

export default interface AudioInputReceiverHandler {
    support(channel: Channel): boolean;

    receiveText(text: string): Promise<void>;
}
