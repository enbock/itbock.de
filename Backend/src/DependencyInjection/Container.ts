import Handler from '../Application/Handler';
import MfaService from '../Core/Mfa/MfaService';
import S3TokenStore from '../Infrastructure/TokenStorage/S3TokenStore';
import TokenPresenter from '../Application/Mfa/TokenPresenter';
import {S3} from '@aws-sdk/client-s3';
import {authenticator} from 'otplib';
import ParseHelper from '../ParseHelper';
import GptBackend from '../Core/Gpt/GptBackend';
import GptUseCase from '../Core/Gpt/GptUseCase';
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


export class Container {
    private appName: string = 'Bock-Laboratories';
    private s3: S3 = new S3();
    private tokenStore: S3TokenStore = new S3TokenStore(
        this.s3, process.env.S3_BUCKET_NAME!, process.env.S3_TOKEN_PATH!
    );
    private mfaService: MfaService = new MfaService(this.appName, this.tokenStore, authenticator);
    private tokenPresenter: TokenPresenter = new TokenPresenter();

    private generateTokenController: GenerateTokenController = new GenerateTokenController(this.mfaService, this.tokenPresenter);
    private validateTokenController: ValidateTokenController = new ValidateTokenController(this.mfaService);

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
    private gptController: GptController = new GptController(
        this.gptUseCase,
        this.bodyParser,
        this.gptPresenter
    );

    private audioTransformClient: OpenAiAudioTransform = new OpenAiAudioTransform(
        this.openAi
    );
    private audioTransformUseCase: AudioTransformUseCase = new AudioTransformUseCase(this.audioTransformClient);
    private audioTransformController: AudioTransformController = new AudioTransformController(this.audioTransformUseCase);

    public handler: Handler = new Handler(
        this.generateTokenController,
        this.validateTokenController,
        this.gptController,
        this.audioTransformController
    );
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
