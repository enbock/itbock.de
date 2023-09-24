import Welcome from 'Application/Welcome/View/Welcome';
import RootComponent from 'Application/RootComponent';
import ModuleController from 'Application/ModuleController';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import Component from '@enbock/ts-jsx/Component';
import ControllerHandler from 'Application/ControllerHandler';
import OldHomepageUseCase from 'Core/Welcome/OldHomepageUseCase/OldHomepageUseCase';
import StateUseCase from 'Core/Welcome/StateUseCase/StateUseCase';
import StateResponse from 'Application/Welcome/Controller/StateResponse';
import WelcomePresenter from 'Application/Welcome/View/WelcomePresenter';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';

export default class Controller implements ModuleController {
    private view?: RootComponent;

    constructor(
        viewTemplate: typeof Welcome,
        private conversationUseCase: GeneralConversationUseCase,
        private audioControllerBus: AudioControllerBus,
        private handlers: Array<ControllerHandler>,
        private oldHomepageUseCase: OldHomepageUseCase,
        private stateUseCase: StateUseCase,
        private welcomePresenter: WelcomePresenter,
        private startControllerBus: StartControllerBus
    ) {
        viewTemplate.componentReceiver = this;
    }

    public setComponent(view: Component & RootComponent): void {
        this.view = view;
    }

    public async init(): Promise<void> {
        this.oldHomepageUseCase.initialize();

        const boundPresentData: Callback = () => this.presentAndRefresh();
        this.handlers.forEach(h => h.init(boundPresentData));
        
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

    public async presentData(): Promise<void> {
        if (!this.view) return;

        const response: StateResponse = new StateResponse();
        this.stateUseCase.getState(response);
        this.view.model = this.welcomePresenter.present(response);
    }
}
