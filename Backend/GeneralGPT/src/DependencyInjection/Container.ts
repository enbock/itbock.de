// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import ParseHelper from '../ParseHelper';
import CoreGptGptBackend from '../Core/Gpt/GptBackend';
import CoreGptGptUseCase from '../Core/Gpt/GptUseCase';
import ApplicationBodyParser from '../Application/BodyParser';
import ApplicationProgram from '../Application/Program';
import OpenAI from 'openai';
import InfrastructureGptNetwork from '../Infrastructure/Gpt/Network';

class Container {
    private openAi: OpenAI = new OpenAI({
        organization: process.env.OPENAI_API_ORG || '',
        apiKey: process.env.OPENAI_API_KEY || ''
    });
    private gptBackend: CoreGptGptBackend = new InfrastructureGptNetwork(this.openAi);
    private parseHelper: ParseHelper = new ParseHelper();
    private applicationBodyParser: ApplicationBodyParser = new ApplicationBodyParser(this.parseHelper);
    private coreGptGptUseCase: CoreGptGptUseCase = new CoreGptGptUseCase(this.gptBackend);
    public applicationProgram: ApplicationProgram = new ApplicationProgram(this.coreGptGptUseCase, this.applicationBodyParser);
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
