import ControllerHandler, {PresentDataCallback} from 'Application/ControllerHandler';
import Adapter from 'Application/Audio/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioInputReceiverHandler from 'Application/Audio/Controller/Handler/AudioInputReceiverHandler';
import InputResponse from 'Application/Audio/Controller/Handler/InputResponse';
import AudioTransformUseCase from 'Core/Audio/InputUseCase/AudioTransformUseCase';

export default class AudioInputHandler implements ControllerHandler {
    private presentData: PresentDataCallback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private inputUseCase: InputUseCase,
        private audioTransformUseCase: AudioTransformUseCase,
        private receivers: Array<AudioInputReceiverHandler>
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioBlobInput = (audioBlob: Blob) => this.handleAudioBlob(audioBlob);
    }

    public async handleAudioBlob(audioBlob: Blob): Promise<void> {
        const text: string = await this.audioTransformUseCase.transcribeAudio(audioBlob);

        const response: InputResponse = new InputResponse();
        this.inputUseCase.inputFinished({text: text}, response);

        for (const receiver of this.receivers) {
            if (receiver.support(response.channel) == false) continue;

            await receiver.receiveText(text);
            break;
        }

        await this.presentData();
    }
}
