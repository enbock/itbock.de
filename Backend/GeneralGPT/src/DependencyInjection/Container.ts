// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import ParseHelper from '../ParseHelper';
import CoreGptGptBackend from '../Core/Gpt/GptBackend';
import CoreGptGptUseCase from '../Core/Gpt/GptUseCase';
import ApplicationBodyParser from '../Application/BodyParser';
import Controller from '../Application/Controller';
import OpenAI from 'openai';
import InfrastructureGptNetwork from '../Infrastructure/Gpt/OpenAiSdk';
import AudioSyntheseClientOpenAi from '../Infrastructure/AudioSyntheseClient/OpenAi/OpenAi';
import Config from './Config';
import ApplicationPresenter from '../Application/Presenter';

class Container {
    private config: Config = new Config();
    private openAi: OpenAI = new OpenAI({
        organization: process.env.OPENAI_API_ORG || '',
        apiKey: this.config.openAiApiKey
    });
    private gptBackend: CoreGptGptBackend = new InfrastructureGptNetwork(this.openAi);
    private parseHelper: ParseHelper = new ParseHelper();
    private applicationBodyParser: ApplicationBodyParser = new ApplicationBodyParser(this.parseHelper);
    private audioSyntheseClientOpenAi: AudioSyntheseClientOpenAi = new AudioSyntheseClientOpenAi(
        'https://api.openai.com/v1/audio/speech',
        this.config.openAiApiKey
    );
    private coreGptGptUseCase: CoreGptGptUseCase = new CoreGptGptUseCase(
        this.gptBackend,
        this.audioSyntheseClientOpenAi
    );
    private applicationPresenter: ApplicationPresenter = new ApplicationPresenter();
    public applicationProgram: Controller = new Controller(
        this.coreGptGptUseCase,
        this.applicationBodyParser,
        this.applicationPresenter
    );
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
