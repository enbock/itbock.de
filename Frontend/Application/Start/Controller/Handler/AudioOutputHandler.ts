import ControllerHandler from 'Application/ControllerHandler';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import Adapter from 'Application/Start/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class AudioOutputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private playbackUseCase: PlaybackUseCase,
        private inputUseCase: InputUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioFinished = () => this.handleFinishing();
    }

    private async handleFinishing(): Promise<void> {
        this.playbackUseCase.endPlayback();
        this.inputUseCase.startInput();
        await this.presentData();
    }
}
