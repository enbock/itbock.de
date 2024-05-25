import ControllerHandler from 'Application/ControllerHandler';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import Adapter from 'Application/Start/Adapter';

export default class AudioOutputHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private playbackUseCase: PlaybackUseCase
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
    }

    private async handleLoaded(): Promise<void> {
        this.playbackUseCase.playbackLoaded();
        await this.presentData();
    }
}
