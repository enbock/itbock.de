import ControllerHandler from 'Application/ControllerHandler';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import Adapter from 'Application/Audio/Adapter';

export default class AudioOutputHandler implements ControllerHandler {
    constructor(
        private adapter: Adapter,
        private playbackUseCase: PlaybackUseCase
    ) {
    }

    public init(presentData: Callback): void {
        this.presentData = presentData;
        this.adapter.audioFinished = () => this.handleFinishing();
    }

    private presentData: Callback = () => <never>false;

    private async handleFinishing(): Promise<void> {
        this.playbackUseCase.endPlayback();
        await this.presentData();
    }
}
