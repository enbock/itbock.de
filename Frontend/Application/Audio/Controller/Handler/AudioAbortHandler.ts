import Adapter from 'Application/Audio/Adapter';
import ControllerHandler, {PresentDataCallback} from 'Application/ControllerHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import ConversationResetUseCase from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';

export default class AudioAbortHandler implements ControllerHandler {
    private presentData: PresentDataCallback = () => false as never;

    constructor(
        private adapter: Adapter,
        private audioInputUseCase: AudioInputUseCase,
        private conversationResetUseCase: ConversationResetUseCase
    ) {
    }

    public async initialize(presentData: PresentDataCallback): Promise<void> {
        this.presentData = presentData;

        this.adapter.audioAbort = () => this.handleAudioAbort();
    }

    private async handleAudioAbort(): Promise<void> {
        this.conversationResetUseCase.resetConversation();
        this.audioInputUseCase.mute();
        await this.presentData();
    }
}
