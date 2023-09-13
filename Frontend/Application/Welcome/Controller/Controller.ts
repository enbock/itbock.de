import Welcome from 'Application/Welcome/View/Welcome';
import RootComponent from 'Application/RootComponent';
import ModuleController from 'Application/ModuleController';
import GeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';
import Component from '@enbock/ts-jsx/Component';
import ControllerHandler from 'Application/ControllerHandler';
import StartStorage from 'Core/Start/StartStorage';
import WelcomeModel from 'Application/Welcome/View/WelcomeModel';

export default class Controller implements ModuleController {
    private view?: RootComponent;

    constructor(
        viewTemplate: typeof Welcome,
        private conversationUseCase: GeneralConversationUseCase,
        private startControllerBus: StartControllerBus,
        private handlers: Array<ControllerHandler>,
        private startStorage: StartStorage
    ) {
        viewTemplate.componentReceiver = this;
    }

    public setComponent(view: Component & RootComponent): void {
        this.view = view;
    }

    public async init(): Promise<void> {
        const boundPresentData: Callback = () => this.presentData();
        this.handlers.forEach(h => h.init(boundPresentData));
        await this.conversationUseCase.runConversation({conversation: ''});
        await this.startControllerBus.refresh();
    }

    public async presentData(): Promise<void> {
        if (!this.view) return;

        // TODO: Usecase, storage and presenter einbauen
        const welcomeModel: WelcomeModel = new WelcomeModel();
        welcomeModel.showOldHomepages = this.startStorage.getShowLinks();
        this.view.model = welcomeModel;
        await this.startControllerBus.refresh();
    }
}
