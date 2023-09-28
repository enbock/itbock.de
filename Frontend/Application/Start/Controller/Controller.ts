import start, {Start} from 'Application/Start/View/Start';
import {ShadowComponentReceiver} from '@enbock/ts-jsx/Component';
import StartPresenter from 'Application/Start/View/StartPresenter';
import ModuleController from 'Application/ModuleController';
import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';
import DataCollector from 'Application/Start/Controller/DataCollector';
import DataCollection from 'Application/Start/Controller/DataCollection';

export default class Controller implements ShadowComponentReceiver {
    private startView?: Start;

    constructor(
        private document: Document,
        private initializeApplicationView: typeof start,
        view: typeof Start,
        private startUseCase: StartUseCase,
        private presenter: StartPresenter,
        private moduleControllers: Array<ModuleController>,
        private handlers: Array<ControllerHandler>,
        private startControllerBus: StartControllerBus,
        private dataCollector: DataCollector
    ) {
        view.componentReceiver = this;
    }

    public setComponent(view: Start): void {
        this.startView = view;
        void this.presentData();
    }

    public start(): void {
        void this.initializeController();

        this.initializeApplicationView(this.document);
    }

    private async initializeController(): Promise<void> {
        const boundPresentData: Callback = async () => this.presentData();

        this.startControllerBus.refresh = boundPresentData;
        this.handlers.forEach(h => h.init(boundPresentData));

        this.startUseCase.initialize();
        await this.presentData();
        await this.startModules();
    }

    private async startModules(): Promise<void> {
        const callStack: Array<Promise<void>> = [];
        for (const controller of this.moduleControllers) callStack.push(controller.init());
        await Promise.all(callStack);
    }

    private async presentData(): Promise<void> {
        if (!this.startView) return;

        const data: DataCollection = this.dataCollector.getData();
        this.startView.model = this.presenter.presentData(data);
    }
}
