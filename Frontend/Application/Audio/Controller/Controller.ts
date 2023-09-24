import {ShadowComponentReceiver} from '@enbock/ts-jsx/Component';
import ControllerHandler from 'Application/ControllerHandler';
import Audio from 'Application/Audio/View/Audio';
import AudioPresenter from 'Application/Audio/View/AudioPresenter';
import StateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import StateResponse from 'Application/Audio/Controller/StateResponse';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';

export default class Controller implements ShadowComponentReceiver {
    private view?: Audio;

    constructor(
        viewComponent: typeof Audio,
        private audioPresenter: AudioPresenter,
        private handlers: Array<ControllerHandler>,
        private stateUseCase: StateUseCase,
        private audioControllerBus: AudioControllerBus
    ) {
        viewComponent.componentReceiver = this;
    }

    public setComponent(view: Audio): void {
        this.view = view;
        void this.initializeController();
        void this.presentData();
    }

    private async initializeController(): Promise<void> {
        const boundPresentData: Callback = async () => this.presentData();
        this.audioControllerBus.refresh = boundPresentData;
        this.handlers.forEach(h => h.init(boundPresentData));
        await this.presentData();
    }

    private async presentData(): Promise<void> {
        if (!this.view) return;

        const stateResponse: StateResponse = new StateResponse();
        this.stateUseCase.getState(stateResponse);
        this.view.model = this.audioPresenter.present(stateResponse);
    }
}
