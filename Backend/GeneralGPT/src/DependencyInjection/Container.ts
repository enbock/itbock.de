// @formatter:off
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import ParseHelper from '../ParseHelper';
import CoreGptGptBackend from '../Core/Gpt/GptBackend';
import CoreGptGptUseCase from '../Core/Gpt/GptUseCase';
import ApplicationBodyParser from '../Application/BodyParser';
import ApplicationProgram from '../Application/Program';
import OpenAI from 'openai';
import InfrastructureGptNetwork from '../Infrastructure/Gpt/Network';
interface ManualInjections {
    infrastructureGptNetworkOpenAI: OpenAI;
}
interface InterfaceInstances {
    coreGptGptBackend: CoreGptGptBackend;
}
interface AdditionalResources {
    InfrastructureGptNetwork: InfrastructureGptNetwork;
}
class Container {
    private _infrastructureGptNetwork?: InfrastructureGptNetwork;
    public get infrastructureGptNetwork(): InfrastructureGptNetwork {
        if (this._infrastructureGptNetwork)
            return this._infrastructureGptNetwork;
        else
            return this._infrastructureGptNetwork = new InfrastructureGptNetwork(this.manualInjections.infrastructureGptNetworkOpenAI);
    }
    private manualInjections: ManualInjections = {
        infrastructureGptNetworkOpenAI: new OpenAI({
            organization: process.env.OPENAI_API_ORG || "",
            apiKey: process.env.OPENAI_API_KEY || ""
        })
    };
    private interfaceInstances: InterfaceInstances = {
        coreGptGptBackend: this.infrastructureGptNetwork
    };
    constructor() {
    }
    public get coreGptGptBackend(): CoreGptGptBackend {
        return this.interfaceInstances.coreGptGptBackend;
    }
    private _parseHelper?: ParseHelper;
    public get parseHelper(): ParseHelper {
        if (this._parseHelper)
            return this._parseHelper;
        else
            return this._parseHelper = new ParseHelper();
    }
    private _applicationBodyParser?: ApplicationBodyParser;
    public get applicationBodyParser(): ApplicationBodyParser {
        if (this._applicationBodyParser)
            return this._applicationBodyParser;
        else
            return this._applicationBodyParser = new ApplicationBodyParser(this.parseHelper);
    }
    private _coreGptGptUseCase?: CoreGptGptUseCase;
    public get coreGptGptUseCase(): CoreGptGptUseCase {
        if (this._coreGptGptUseCase)
            return this._coreGptGptUseCase;
        else
            return this._coreGptGptUseCase = new CoreGptGptUseCase(this.coreGptGptBackend);
    }
    private _applicationProgram?: ApplicationProgram;
    public get applicationProgram(): ApplicationProgram {
        if (this._applicationProgram)
            return this._applicationProgram;
        else
            return this._applicationProgram = new ApplicationProgram(this.coreGptGptUseCase, this.applicationBodyParser);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
