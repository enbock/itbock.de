import ControllerHandler from 'Application/ControllerHandler';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import Adapter from 'Application/Audio/Adapter';
import StartControllerBus from 'Application/Start/Controller/StartControllerBus';

export default class AudioOutputHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private playbackUseCase: PlaybackUseCase,
        private startControllerBus: StartControllerBus
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioFinished = () => this.handleFinishing();
        this.adapter.audioLoaded = () => this.handleLoaded();
    }

    private presentData: Callback = () => <never>false;

    private async handleFinishing(): Promise<void> {
        this.playbackUseCase.endPlayback();
        await this.presentData();
        await this.startControllerBus.refresh();
    }

    private async handleLoaded(): Promise<void> {
        this.playbackUseCase.playbackLoaded();
        await this.presentData();
        await this.startControllerBus.refresh();
    }
}
