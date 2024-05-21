import CommandHandler from 'Application/Command/CommandHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';

export default class SuspendCommand implements CommandHandler {
    constructor(
        private audioInputUseCase: AudioInputUseCase,
        private audioControllerBus: AudioControllerBus
    ) {
    }

    public support(command: string): boolean {
        return command == 'topicEnd';
    }

    public async run(): Promise<void> {
        this.audioInputUseCase.suspend();
        void this.audioControllerBus.refresh();
    }
}
