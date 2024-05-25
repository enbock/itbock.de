import Adapter from 'Application/Start/Adapter';
import ControllerHandler, {PresentDataCallback} from 'Application/ControllerHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';

export default class AudioAbortHandler implements ControllerHandler {
    private presentData: PresentDataCallback = () => false as never;

    constructor(
        private adapter: Adapter,
        private audioInputUseCase: AudioInputUseCase,
        private conversationResetUseCase: ConversationUseCase,
        private startUseCase: StartUseCase
    ) {
    }

    public async initialize(presentData: PresentDataCallback): Promise<void> {
        this.presentData = presentData;

        this.adapter.audioAbort = () => this.handleAudioAbort();
    }

    private async handleAudioAbort(): Promise<void> {
        this.conversationResetUseCase.resetConversation();
        this.audioInputUseCase.mute();
        this.startUseCase.initialize(navigator.language);

        void this.presentData();
    }
}
