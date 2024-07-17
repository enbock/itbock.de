import ControllerHandler from 'Application/ControllerHandler';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import Adapter from 'Application/Start/Adapter';

export default class AudioOutputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private playbackUseCase: PlaybackUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioFinished = () => this.handleFinishing();
    }

    private async handleFinishing(): Promise<void> {
        this.playbackUseCase.endPlayback();
        await this.presentData();
    }
}
