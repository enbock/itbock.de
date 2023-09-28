import Adapter from 'Application/Welcome/Adapter';
import ControllerHandler from 'Application/ControllerHandler';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';

export default class StartHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private conversationUseCase: GeneralConversationUseCase,
        private audioControllerBus: AudioControllerBus,
        private startControllerBus: StartControllerBus
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.closeStart = () => this.handleStart();
    }

    private async handleStart(): Promise<void> {
        await this.startControllerBus.start();
        await this.presentData();
        
        await this.conversationUseCase.startConversation({
            onStateChange: () => this.startControllerBus.refresh()
        });
        await this.presentAndRefresh();
    }

    public async presentAndRefresh(): Promise<void> {
        await this.presentData();
        await this.audioControllerBus.refresh();
        await this.startControllerBus.refresh();
    }
}
