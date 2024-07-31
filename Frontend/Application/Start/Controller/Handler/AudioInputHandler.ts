import ControllerHandler, {PresentDataCallback} from 'Application/ControllerHandler';
import Adapter from 'Application/Start/Adapter';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioTransformUseCase from 'Core/Audio/AudioTransformCase/AudioTransformUseCase';
import FeedbackUseCase from 'Core/Audio/FeedbackUseCase/FeedbackUseCase';
import StartBus from 'Application/Start/StartBus';

export default class AudioInputHandler implements ControllerHandler {
    private presentData: PresentDataCallback = () => <never>false;

    constructor(
        private adapter: Adapter,
        private inputUseCase: InputUseCase,
        private audioTransformUseCase: AudioTransformUseCase,
        private feedbackUseCase: FeedbackUseCase,
        private startBus: StartBus
    ) {
    }

    public async initialize(presentData: Callback): Promise<void> {
        this.presentData = presentData;
        this.adapter.audioBlobInput = (audioBase64: string) => this.handleAudioBlob(audioBase64);
    }

    public async handleAudioBlob(audioBase64: string): Promise<void> {
        void this.feedbackUseCase.beep();
        const text: string = await this.audioTransformUseCase.transcribeAudio(audioBase64);

        this.inputUseCase.inputFinished();
        void this.presentData();

        void this.startBus.receiveText(text);
    }
}
