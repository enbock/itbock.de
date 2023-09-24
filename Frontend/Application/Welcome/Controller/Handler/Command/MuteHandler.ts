import CommandHandler from 'Application/Welcome/Controller/Handler/Command/CommandHandler';
import AudioInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';

export default class MuteHandler implements CommandHandler {
    constructor(
        private audioInputUseCase: AudioInputUseCase,
        private audioControllerBus: AudioControllerBus
    ) {
    }

    public async run(): Promise<void> {
        this.audioInputUseCase.mute();
        await this.audioControllerBus.refresh();
    }

    public support(command: string): boolean {
        return command == 'mute';
    }
}
