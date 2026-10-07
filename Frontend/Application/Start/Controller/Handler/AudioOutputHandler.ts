import ControllerHandler from 'Application/ControllerHandler';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import Adapter from 'Application/Start/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import LeaderUseCase from 'Core/Replication/LeaderUseCase/LeaderUseCase';

export default class AudioOutputHandler implements ControllerHandler {
    private presentData: Callback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private playbackUseCase: PlaybackUseCase,
        private inputUseCase: InputUseCase,
        private leaderUseCase: LeaderUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioFinished = () => this.handleFinishing();
    }

    private async handleFinishing(): Promise<void> {
        this.playbackUseCase.endPlayback();
        if (this.leaderUseCase.isLeader()) this.inputUseCase.startInput();
        await this.presentData();
    }
}
