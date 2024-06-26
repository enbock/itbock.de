import ControllerHandler, {PresentDataCallback} from 'Application/ControllerHandler';
import Adapter from 'Application/Start/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioInputReceiverHandler from 'Application/Start/Controller/Handler/AudioInputReceiverHandler';
import InputResponse from 'Application/Start/Controller/Handler/InputResponse';
import AudioTransformUseCase from 'Core/Audio/InputUseCase/AudioTransformUseCase';
import FeedbackUseCase from 'Core/Audio/FeedbackUseCase/FeedbackUseCase';

export default class AudioInputHandler implements ControllerHandler {
    private presentData: PresentDataCallback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private inputUseCase: InputUseCase,
        private audioTransformUseCase: AudioTransformUseCase,
        private receivers: Array<AudioInputReceiverHandler>,
        private feedbackUseCase: FeedbackUseCase
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioBlobInput = (audioBase64: string) => this.handleAudioBlob(audioBase64);
    }

    public async handleAudioBlob(audioBase64: string): Promise<void> {
        void this.feedbackUseCase.beep();
        const text: string = await this.audioTransformUseCase.transcribeAudio(audioBase64);

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
