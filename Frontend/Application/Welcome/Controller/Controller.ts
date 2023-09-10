import Welcome from 'Application/Welcome/View/Welcome';
import RootComponent from 'Application/RootComponent';
import ModuleController from 'Application/ModuleController';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import ConversationResponse from 'Application/Welcome/Controller/ConversationResponse';
import RunResponse from 'Core/Gpt/GeneralConversationUseCase/RunResponse';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';

export default class Controller implements ModuleController {
    private view?: RootComponent;

    constructor(
        view: typeof Welcome,
        private conversationUseCase: GeneralConversationUseCase,
        private startControllerBus: StartControllerBus
    ) {
        view.componentReceiver = this;
    }

    public setComponent(view: RootComponent): void {
        this.view = view;
    }

    public async init(): Promise<void> {
        const response: RunResponse = new ConversationResponse();
        await this.conversationUseCase.runConversation(response);
        await this.startControllerBus.refresh();
    }
}
