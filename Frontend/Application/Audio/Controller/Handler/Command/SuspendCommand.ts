import CommandHandler from 'Application/Command/CommandHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';

export default class SuspendCommand implements CommandHandler {
    constructor(
        private audioInputUseCase: AudioInputUseCase
    ) {
    }

    public support(command: string): boolean {
        return command == 'topicEnd';
    }

    public async run(): Promise<void> {
        this.audioInputUseCase.suspend();
    }
}
