import start, {Start} from 'Application/Start/View/Start';
import {ShadowComponentReceiver} from '@enbock/ts-jsx/Component';
import RootComponent from 'Application/RootComponent';
import StateResponse from 'Application/Start/Controller/StateResponse';
import StartPresenter from 'Application/Start/View/StartPresenter';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import Adapter from 'Application/Start/Adapter';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';
import ModuleController from 'Application/ModuleController';

export default class Controller implements ShadowComponentReceiver {
    private view?: RootComponent;

    constructor(
        private document: Document,
        private initializeApplicationView: typeof start,
        view: typeof Start,
        private startUseCase: StartUseCase,
        private presenter: StartPresenter,
        private moduleControllers: Array<ModuleController>,
        private adapter: Adapter,
        private bus: StartControllerBus
    ) {
        view.componentReceiver = this;
    }

    public setComponent(view: RootComponent): void {
        this.view = view;
        this.presentData();
    }

    public start(): void {
        void this.initializeController();
        this.adapter.closeStart = () => this.handleStart();
        this.bus.refresh = async () => this.presentData();

        this.initializeApplicationView(this.document);
    }


    private async initializeController(): Promise<void> {
        this.startUseCase.initialize();
        this.presentData();

        const callStack: Array<Promise<void>> = [];
        for (const controller of this.moduleControllers) callStack.push(controller.init());
        await Promise.all(callStack);
    }

    private presentData(): void {
        if (!this.view) return;

        const stateResponse: StateResponse = new StateResponse();
        this.startUseCase.getState(stateResponse);
        this.view.model = this.presenter.presentData(stateResponse);
    }

    private async handleStart(): Promise<void> {
        this.startUseCase.startApplication();
        this.presentData();
    }
}
