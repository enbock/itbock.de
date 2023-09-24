import start, {Start} from 'Application/Start/View/Start';
import {ShadowComponentReceiver} from '@enbock/ts-jsx/Component';
import StateResponse from 'Application/Start/Controller/StateResponse';
import StartPresenter from 'Application/Start/View/StartPresenter';
import ModuleController from 'Application/ModuleController';
import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';

export default class Controller implements ShadowComponentReceiver {
    private startView?: Start;

    constructor(
        private document: Document,
        private initializeApplicationView: typeof start,
        view: typeof Start,
        private startUseCase: StartUseCase,
        private presenter: StartPresenter,
        private moduleControllers: Array<ModuleController>,
        private handlers: Array<ControllerHandler>
    ) {
        view.componentReceiver = this;
    }

    public setComponent(view: Start): void {
        this.startView = view;
        this.presentData();
    }

    public start(): void {
        void this.initializeController();

        this.initializeApplicationView(this.document);
    }


    private async initializeController(): Promise<void> {
        const boundPresentData: Callback = async () => this.presentData();
        this.handlers.forEach(h => h.init(boundPresentData));
        this.startUseCase.initialize();
        this.presentData();

        const callStack: Array<Promise<void>> = [];
        for (const controller of this.moduleControllers) callStack.push(controller.init());
        await Promise.all(callStack);
    }

    private presentData(): void {
        if (!this.startView) return;

        const stateResponse: StateResponse = new StateResponse();
        this.startUseCase.getState(stateResponse);
        this.startView.model = this.presenter.presentData(stateResponse);
    }
}
