import Adapter from 'Application/Start/Adapter';
import renderApplication, {Start} from 'Application/Start/View/Start';
import StartPresenter from 'Application/Start/View/StartPresenter';
import ModuleController from 'Application/ModuleController';
import ControllerHandler from 'Application/ControllerHandler';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import DataCollector from 'Application/Start/Controller/DataCollector';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class Controller {
    private startView?: Start;

    constructor(
        private document: Document,
        private renderApplication: (document: Document, adapter: Adapter) => Start,
        private adapter: Adapter,
        private startUseCase: StartUseCase,
        private presenter: StartPresenter,
        private moduleControllers: Array<ModuleController>,
        private handlers: Array<ControllerHandler>,
        private dataCollector: DataCollector,
        private defaultLanguage: string,
        private audioInputUseCase: AudioInputUseCase
    ) {
    }

    public async start(): Promise<void> {
        this.audioInputUseCase.initialize();
        await this.initializeController();

        this.startView = this.renderApplication(this.document, this.adapter);
        await this.presentData();
    }

    private async initializeController(): Promise<void> {
        this.startUseCase.initialize(this.defaultLanguage);

        const boundPresentData: Callback = async () => this.presentData();
        const handlerInitialization: Array<Promise<void>> = [];

        this.handlers.forEach((handler: ControllerHandler) => {
            handlerInitialization.push(handler.initialize(boundPresentData));
        });

        await Promise.all(handlerInitialization);

        await this.startModules();
    }

    private async startModules(): Promise<void> {
        const callStack: Array<Promise<void>> = [];
        for (const controller of this.moduleControllers) callStack.push(controller.initialize());
        await Promise.all(callStack);
    }

    private async presentData(): Promise<void> {
        if (!this.startView) return;

        const data: ResponseCollection = await this.dataCollector.getData();
        this.startView.model = this.presenter.presentData(data);
    }
}
