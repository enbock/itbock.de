import Adapter from 'Application/Audio/Adapter';
import ControllerHandler, {PresentDataCallback} from 'Application/ControllerHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import ConversationResetUseCase from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';
import WelcomeControllerBus from 'Application/Welcome/Controller/WelcomeControllerBus';

export default class AudioAbortHandler implements ControllerHandler {
    private presentData: PresentDataCallback = () => false as never;

    constructor(
        private adapter: Adapter,
        private audioInputUseCase: AudioInputUseCase,
        private conversationResetUseCase: ConversationResetUseCase,
        private startUseCase: StartUseCase,
        private startControllerBus: StartControllerBus,
        private welcomeControllerBus: WelcomeControllerBus
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

        void this.startControllerBus.refresh();
        void this.welcomeControllerBus.refresh();
        void this.presentData();
    }
}
