import start, {Start} from 'Application/Start/View/Start';
import {ShadowComponentReceiver} from '@enbock/ts-jsx/Component';
import StartPresenter from 'Application/Start/View/StartPresenter';
import ModuleController from 'Application/ModuleController';
import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import DataCollector from 'Application/Start/Controller/DataCollector';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class Controller implements ShadowComponentReceiver {
    private startView?: Start;

    constructor(
        private document: Document,
        private renderApplication: typeof start,
        view: typeof Start,
        private startUseCase: StartUseCase,
        private presenter: StartPresenter,
        private moduleControllers: Array<ModuleController>,
        private handlers: Array<ControllerHandler>,
        private dataCollector: DataCollector,
        private defaultLanguage: string,
        private audioInputUseCase: AudioInputUseCase
    ) {
        view.componentReceiver = this;
    }

    public setComponent(view: Start): void {
        this.startView = view;
        void this.presentData();
    }

    public async start(): Promise<void> {
        this.audioInputUseCase.initialize();
        await this.initializeController();

        this.renderApplication(this.document);
    }

    private async initializeController(): Promise<void> {
        this.startUseCase.initialize(this.defaultLanguage);

        const boundPresentData: Callback = async () => this.presentData();

        this.handlers.forEach(h => h.initialize(boundPresentData));

        await this.presentData();
        await this.startModules();
    }

    private async startModules(): Promise<void> {
        const callStack: Array<Promise<void>> = [];
        for (const controller of this.moduleControllers) callStack.push(controller.initialize());
        await Promise.all(callStack);
    }

    private async presentData(): Promise<void> {
        if (!this.startView) return;

        const data: ResponseCollection = this.dataCollector.getData();
        this.startView.model = this.presenter.presentData(data);
    }
}
