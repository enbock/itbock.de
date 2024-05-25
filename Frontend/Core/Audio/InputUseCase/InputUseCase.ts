import AudioStorage from 'Core/Audio/AudioStorage';
import EndOfInputRequest from 'Core/Audio/InputUseCase/EndOfInputRequest';
import FinishedInputResponse from 'Core/Audio/InputUseCase/FinishedInputResponse';
import Channel from 'Core/Audio/InputUseCase/Channel';
import {UpdateRequest} from 'Core/Audio/InputUseCase/UpdateRequest';
import Modules from 'Core/Start/Modules';
import StartStorage from 'Core/Start/StartStorage';

export default class InputUseCase {
    constructor(
        private audioStorage: AudioStorage,
        private wakeUpWords: Array<string>,
        private startStorage: StartStorage
    ) {
    }

    public inputFinished(request: EndOfInputRequest, response: FinishedInputResponse): void {
        this.audioStorage.setListening(false);

        response.channel = Channel.NONE;

        if (this.audioStorage.getSuspended())
            return this.checkEndOfSuspend(request, response);

        response.channel = Channel.DEFAULT;
    }

    public initialize(): void {
        this.audioStorage.setMicrophoneMuted(true);
    }

    public restart(): void {
        this.audioStorage.setMicrophoneMuted(false);
        this.audioStorage.setListening(false);
        this.audioStorage.setLoading(false);
        this.audioStorage.setPlaying(false);
        this.audioStorage.setBuffer([]);
        this.audioStorage.setPlayingText({text: '', audio: ''});
    }

    public mute(): void {
        this.audioStorage.setMicrophoneMuted(true);
    }

    public startInput(): void {
        this.audioStorage.setListening(true);
    }

    private checkEndOfSuspend(request: EndOfInputRequest, response: FinishedInputResponse): void {
        const words: Array<string> = request.text.split(' ').map(s => s.trim().toLocaleLowerCase()).slice(0, 3);

        const foundMagicWord: boolean = words.find(
            word => this.wakeUpWords.find(
                magicWord => word.indexOf(magicWord) > -1
            ) !== undefined
        ) !== undefined;
        if (foundMagicWord == false) return;

        this.audioStorage.setSuspended(false);
        response.channel = Channel.DEFAULT;
        this.startStorage.setModuleName(Modules.CONVERSATION);
    }

    public updateByModule(request: UpdateRequest): void {
        if (request.module == Modules.START_SCREEN) this.initialize();
    }
}
