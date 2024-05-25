import MfaService from '../Core/Mfa/MfaService';
import S3TokenStore from '../Infrastructure/TokenStorage/S3TokenStore';
import TokenPresenter from '../Application/Mfa/TokenPresenter';
import {S3} from '@aws-sdk/client-s3';
import {authenticator} from 'otplib';
import ParseHelper from '../ParseHelper';
import GptBackend from '../Core/Gpt/GptBackend';
import BodyParser from '../Application/Gpt/BodyParser';
import GptController from '../Application/Gpt/GptController';
import OpenAI from 'openai';
import OpenAiSdk from '../Infrastructure/Gpt/OpenAiSdk';
import OpenAiAudioSyntheseClient from '../Infrastructure/AudioSyntheseClient/OpenAi/OpenAi';
import GptPresenter from '../Application/Gpt/GptPresenter';
import GenerateTokenController from '../Application/Mfa/GenerateTokenController';
import ValidateTokenController from '../Application/Mfa/ValidateTokenController';
import AudioTransformController from '../Application/Audio/AudioTransformController';
import AudioTransformUseCase from '../Core/Audio/AudioTransformUseCase';
import OpenAiAudioTransform from '../Infrastructure/AudioTransformClient/OpenAiAudioTransform';
import I18nUseCase from '../Core/Gpt/I18nUseCase/I18nUseCase';
import I18nController from '../Application/I18n/I18nController';
import GptUseCase from '../Core/Gpt/UseCase/GptUseCase';


export class Container {
    private appName: string = 'Bock-Laboratories';
    private s3: S3 = new S3();
    private tokenStore: S3TokenStore = new S3TokenStore(
        this.s3, process.env.S3_BUCKET_NAME!, process.env.S3_TOKEN_PATH!
    );
    private mfaService: MfaService = new MfaService(this.appName, this.tokenStore, authenticator);
    public validateTokenController: ValidateTokenController = new ValidateTokenController(this.mfaService);
    private tokenPresenter: TokenPresenter = new TokenPresenter();
    public generateTokenController: GenerateTokenController = new GenerateTokenController(this.mfaService, this.tokenPresenter);
    private openAi: OpenAI = new OpenAI({
        organization: process.env.OPENAI_API_ORG || '',
        apiKey: process.env.OPENAI_API_KEY || ''
    });
    private gptBackend: GptBackend = new OpenAiSdk(this.openAi);
    private parseHelper: ParseHelper = new ParseHelper();
    private bodyParser: BodyParser = new BodyParser(this.parseHelper);
    private audioSyntheseClient: OpenAiAudioSyntheseClient = new OpenAiAudioSyntheseClient(
        'https://api.openai.com/v1/audio/speech',
        process.env.OPENAI_API_KEY || ''
    );
    private gptUseCase: GptUseCase = new GptUseCase(
        this.gptBackend,
        this.audioSyntheseClient
    );
    private gptPresenter: GptPresenter = new GptPresenter();
    public gptController: GptController = new GptController(
        this.gptUseCase,
        this.bodyParser,
        this.gptPresenter
    );

    private audioTransformClient: OpenAiAudioTransform = new OpenAiAudioTransform(
        this.openAi
    );
    private audioTransformUseCase: AudioTransformUseCase = new AudioTransformUseCase(this.audioTransformClient);
    public audioTransformController: AudioTransformController = new AudioTransformController(this.audioTransformUseCase);

    private i18nUseCase: I18nUseCase = new I18nUseCase(
        this.gptBackend
    );
    public i18nController: I18nController = new I18nController(this.i18nUseCase);
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
