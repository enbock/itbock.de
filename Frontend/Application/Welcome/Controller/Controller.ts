import Welcome from 'Application/Welcome/View/Welcome';
import RootComponent from 'Application/RootComponent';
import ModuleController from 'Application/ModuleController';
import Component from '@enbock/ts-jsx/Component';
import ControllerHandler from 'Application/ControllerHandler';
import OldHomepageUseCase from 'Core/Welcome/OldHomepageUseCase/OldHomepageUseCase';
import WelcomePresenter from 'Application/Welcome/View/WelcomePresenter';
import DataCollector from 'Application/Welcome/Controller/DataCollector';
import DataCollection from 'Application/Welcome/Controller/DataCollection';

export default class Controller implements ModuleController {
    private view?: RootComponent;

    constructor(
        viewTemplate: typeof Welcome,
        private handlers: Array<ControllerHandler>,
        private oldHomepageUseCase: OldHomepageUseCase,
        private welcomePresenter: WelcomePresenter,
        private dataCollector: DataCollector
    ) {
        viewTemplate.componentReceiver = this;
    }

    public setComponent(view: Component & RootComponent): void {
        this.view = view;
    }

    public async init(): Promise<void> {
        this.oldHomepageUseCase.initialize();

        const boundPresentData: Callback = () => this.presentData();
        this.handlers.forEach(h => h.init(boundPresentData));

        await this.presentData();
    }

    public async presentData(): Promise<void> {
        if (!this.view) return;

        const data: DataCollection = this.dataCollector.getData();
        this.view.model = this.welcomePresenter.present(data);
    }
}
