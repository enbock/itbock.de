// @formatter:off
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import StartAdapter from 'Application/Start/Adapter';
import CoreStartStartUseCaseStartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import WelcomeControllerWelcomeBus from 'Application/Welcome/Controller/WelcomeBus';
import CoreGptGeneralConversationUseCaseGeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import InfrastructureApiHelperFetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import InfrastructureParseHelper from 'Infrastructure/ParseHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import InfrastructureGptClientEncoder from 'Infrastructure/GptClient/Encoder';
import CoreGptGptClient from 'Core/Gpt/GptClient';
import CoreAudioAudioService from 'Core/Audio/AudioService';
import CoreGptConversationStorage from 'Core/Gpt/ConversationStorage';
import CoreAudioAudioStorage from 'Core/Audio/AudioStorage';
import CoreStartStartStorage from 'Core/Start/StartStorage';
import StartControllerStartControllerBus from 'Application/Start/Controller/StartControllerBus';
import AudioViewAudioPresenter from 'Application/Audio/View/AudioPresenter';
import AudioInputInputPresenter from 'Application/Audio/Input/InputPresenter';
import StartViewStartPresenter from 'Application/Start/View/StartPresenter';
import StartControllerController from 'Application/Start/Controller/Controller';
import WelcomeControllerController from 'Application/Welcome/Controller/Controller';
import InfrastructureGptClientNetwork from 'Infrastructure/GptClient/Network';
import CoreGptGptClientNetwork from 'Infrastructure/GptClient/Network';
import WelcomeControllerHandlerConversationInputHandler from 'Application/Welcome/Controller/Handler/ConversationInputHandler';
import StartControllerHandlerAudioInputHandler from 'Application/Start/Controller/Handler/AudioInputHandler';
import AudioInputInput from 'Application/Audio/Input/Input';
import StartControllerHandlerAudioOutputHandler from 'Application/Start/Controller/Handler/AudioOutputHandler';
import ControllerHandler from 'Application/ControllerHandler';
import ModuleController from 'Application/ModuleController';
import renderApplication, {Start} from 'Application/Start/View/Start';
import Welcome from 'Application/Welcome/View/Welcome';
import ViewInjection from '@enbock/ts-jsx/ViewInjection';
import Audio from 'Application/Audio/View/Audio';
import ConversationMemory from 'Infrastructure/Conversation/Memory';
import StartMemory from 'Infrastructure/Storage/Start/Memory';
import AudioMemory from 'Infrastructure/Storage/Audio/Memory';
interface ManualInjections {
    audioInputInputSpeechRecognition: typeof SpeechRecognition;
    startControllerControllerHandlerArray: Array<ControllerHandler>;
    welcomeControllerControllerArray: Array<ControllerHandler>;
    infrastructureGptClientNetworkServiceUrl: string;
    startControllerControllerArray: Array<ModuleController>;
    startControllerControllerView: typeof Start;
    welcomeControllerControllerViewTemplate: typeof Welcome;
    startControllerControllerInitializeApplicationView: typeof renderApplication;
    startControllerControllerDocument: Document;
    audioViewAudioPresenterSoundServiceUrl: string;
    ViewInjection: typeof ViewInjection;
    fetchHelper: FetchHelper;
    parseHelper: ParseHelper;
    audioOutput: typeof Audio;
}
interface InterfaceInstances {
    coreGptConversationStorage: ConversationMemory;
    coreStartStartStorage: StartMemory;
    coreAudioAudioStorage: AudioMemory;
    coreGptGptClient: CoreGptGptClientNetwork;
}
interface AdditionalResources {
    WelcomeControllerController: WelcomeControllerController;
    InfrastructureGptClientNetwork: InfrastructureGptClientNetwork;
    WelcomeControllerHandlerConversationInputHandler: WelcomeControllerHandlerConversationInputHandler;
    StartControllerHandlerAudioInputHandler: StartControllerHandlerAudioInputHandler;
    AudioInputInput: AudioInputInput;
    StartControllerHandlerAudioOutputHandler: StartControllerHandlerAudioOutputHandler;
}
class Container {
    private manualInjections: ManualInjections = {
        welcomeControllerControllerViewTemplate: Welcome,
        startControllerControllerView: Start,
        startControllerControllerDocument: document,
        startControllerControllerInitializeApplicationView: renderApplication,
        audioViewAudioPresenterSoundServiceUrl: "https://api.itbock.de/speech",
        ViewInjection: ViewInjection,
        fetchHelper: new FetchHelper(),
        parseHelper: new ParseHelper(),
        startControllerControllerArray: [],
        infrastructureGptClientNetworkServiceUrl: "https://api.itbock.de/gpt/general",
        welcomeControllerControllerArray: [],
        startControllerControllerHandlerArray: [],
        audioInputInputSpeechRecognition: undefined!,
        audioOutput: Audio
    };
    private interfaceInstances: InterfaceInstances = {
        coreStartStartStorage: new StartMemory(),
        coreAudioAudioStorage: new AudioMemory(),
        coreGptGptClient: "" as any,
        coreGptConversationStorage: new ConversationMemory()
    };
    constructor() {
        this.interfaceInstances.coreGptGptClient = this.infrastructureGptClientNetwork;
        this.manualInjections.welcomeControllerControllerArray = [
            this.welcomeControllerHandlerConversationInputHandler
        ];
        this.manualInjections.startControllerControllerHandlerArray = [
            this.startControllerHandlerAudioInputHandler,
            this.startControllerHandlerAudioOutputHandler
        ];
        this.manualInjections.startControllerControllerArray = [
            this.welcomeControllerController
        ];
        this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.startAdapter, this.startControllerStartControllerBus, this.manualInjections.startControllerControllerHandlerArray);
        const LocalSpeechRecognition = (window as any)["SpeechRecognition"] || (window as any)["webkitSpeechRecognition"] || (window as any)["speechRecognition"];
        this.manualInjections.audioInputInputSpeechRecognition = LocalSpeechRecognition;
        ViewInjection(Start, this.startAdapter, this.audioInputInput);
        ViewInjection(Audio, this.startAdapter);
    }
    public get coreGptConversationStorage(): CoreGptConversationStorage {
        return this.interfaceInstances.coreGptConversationStorage;
    }
    public get coreGptGptClient(): CoreGptGptClient {
        return this.interfaceInstances.coreGptGptClient;
    }
    public get coreAudioAudioStorage(): CoreAudioAudioStorage {
        return this.interfaceInstances.coreAudioAudioStorage;
    }
    public get coreStartStartStorage(): CoreStartStartStorage {
        return this.interfaceInstances.coreStartStartStorage;
    }
    private _startControllerHandlerAudioOutputHandler?: StartControllerHandlerAudioOutputHandler;
    public get startControllerHandlerAudioOutputHandler(): StartControllerHandlerAudioOutputHandler {
        if (this._startControllerHandlerAudioOutputHandler)
            return this._startControllerHandlerAudioOutputHandler;
        else
            return this._startControllerHandlerAudioOutputHandler = new StartControllerHandlerAudioOutputHandler(this.startAdapter, this.coreStartStartUseCaseStartUseCase);
    }
    private _audioInputInput?: AudioInputInput;
    public get audioInputInput(): AudioInputInput {
        if (this._audioInputInput)
            return this._audioInputInput;
        else
            return this._audioInputInput = new AudioInputInput(this.manualInjections.audioInputInputSpeechRecognition, this.startAdapter);
    }
    private _startControllerHandlerAudioInputHandler?: StartControllerHandlerAudioInputHandler;
    public get startControllerHandlerAudioInputHandler(): StartControllerHandlerAudioInputHandler {
        if (this._startControllerHandlerAudioInputHandler)
            return this._startControllerHandlerAudioInputHandler;
        else
            return this._startControllerHandlerAudioInputHandler = new StartControllerHandlerAudioInputHandler(this.startAdapter, this.welcomeControllerWelcomeBus);
    }
    private _welcomeControllerWelcomeBus?: WelcomeControllerWelcomeBus;
    public get welcomeControllerWelcomeBus(): WelcomeControllerWelcomeBus {
        if (this._welcomeControllerWelcomeBus)
            return this._welcomeControllerWelcomeBus;
        else
            return this._welcomeControllerWelcomeBus = new WelcomeControllerWelcomeBus();
    }
    private _welcomeControllerHandlerConversationInputHandler?: WelcomeControllerHandlerConversationInputHandler;
    public get welcomeControllerHandlerConversationInputHandler(): WelcomeControllerHandlerConversationInputHandler {
        if (this._welcomeControllerHandlerConversationInputHandler)
            return this._welcomeControllerHandlerConversationInputHandler;
        else
            return this._welcomeControllerHandlerConversationInputHandler = new WelcomeControllerHandlerConversationInputHandler(this.welcomeControllerWelcomeBus, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase);
    }
    private _infrastructureGptClientEncoder?: InfrastructureGptClientEncoder;
    public get infrastructureGptClientEncoder(): InfrastructureGptClientEncoder {
        if (this._infrastructureGptClientEncoder)
            return this._infrastructureGptClientEncoder;
        else
            return this._infrastructureGptClientEncoder = new InfrastructureGptClientEncoder();
    }
    private _infrastructureParseHelper?: InfrastructureParseHelper;
    public get infrastructureParseHelper(): InfrastructureParseHelper {
        if (this._infrastructureParseHelper)
            return this._infrastructureParseHelper;
        else
            return this._infrastructureParseHelper = new InfrastructureParseHelper();
    }
    private _infrastructureApiHelperFetchHelper?: InfrastructureApiHelperFetchHelper;
    public get infrastructureApiHelperFetchHelper(): InfrastructureApiHelperFetchHelper {
        if (this._infrastructureApiHelperFetchHelper)
            return this._infrastructureApiHelperFetchHelper;
        else
            return this._infrastructureApiHelperFetchHelper = new InfrastructureApiHelperFetchHelper();
    }
    private _infrastructureGptClientNetwork?: InfrastructureGptClientNetwork;
    public get infrastructureGptClientNetwork(): InfrastructureGptClientNetwork {
        if (this._infrastructureGptClientNetwork)
            return this._infrastructureGptClientNetwork;
        else
            return this._infrastructureGptClientNetwork = new InfrastructureGptClientNetwork(this.infrastructureApiHelperFetchHelper, this.infrastructureParseHelper, this.manualInjections.infrastructureGptClientNetworkServiceUrl, this.infrastructureGptClientEncoder);
    }
    private _coreGptGeneralConversationUseCaseGeneralConversationUseCase?: CoreGptGeneralConversationUseCaseGeneralConversationUseCase;
    public get coreGptGeneralConversationUseCaseGeneralConversationUseCase(): CoreGptGeneralConversationUseCaseGeneralConversationUseCase {
        if (this._coreGptGeneralConversationUseCaseGeneralConversationUseCase)
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase;
        else
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase = new CoreGptGeneralConversationUseCaseGeneralConversationUseCase(this.coreGptGptClient, this.coreAudioAudioService, this.coreGptConversationStorage, this.coreAudioAudioStorage, this.coreStartStartStorage);
    }
    private _welcomeControllerController?: WelcomeControllerController;
    public get welcomeControllerController(): WelcomeControllerController {
        if (this._welcomeControllerController)
            return this._welcomeControllerController;
        else
            return this._welcomeControllerController = new WelcomeControllerController(this.manualInjections.welcomeControllerControllerViewTemplate, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.startControllerStartControllerBus, this.manualInjections.welcomeControllerControllerArray, this.coreStartStartStorage);
    }
    private _startControllerStartControllerBus?: StartControllerStartControllerBus;
    public get startControllerStartControllerBus(): StartControllerStartControllerBus {
        if (this._startControllerStartControllerBus)
            return this._startControllerStartControllerBus;
        else
            return this._startControllerStartControllerBus = new StartControllerStartControllerBus();
    }
    private _startAdapter?: StartAdapter;
    public get startAdapter(): StartAdapter {
        if (this._startAdapter)
            return this._startAdapter;
        else
            return this._startAdapter = new StartAdapter();
    }
    private _audioInputInputPresenter?: AudioInputInputPresenter;
    public get audioInputInputPresenter(): AudioInputInputPresenter {
        if (this._audioInputInputPresenter)
            return this._audioInputInputPresenter;
        else
            return this._audioInputInputPresenter = new AudioInputInputPresenter();
    }
    private _audioViewAudioPresenter?: AudioViewAudioPresenter;
    public get audioViewAudioPresenter(): AudioViewAudioPresenter {
        if (this._audioViewAudioPresenter)
            return this._audioViewAudioPresenter;
        else
            return this._audioViewAudioPresenter = new AudioViewAudioPresenter(this.manualInjections.audioViewAudioPresenterSoundServiceUrl);
    }
    private _startViewStartPresenter?: StartViewStartPresenter;
    public get startViewStartPresenter(): StartViewStartPresenter {
        if (this._startViewStartPresenter)
            return this._startViewStartPresenter;
        else
            return this._startViewStartPresenter = new StartViewStartPresenter(this.audioViewAudioPresenter, this.audioInputInputPresenter);
    }
    private _coreAudioAudioService?: CoreAudioAudioService;
    public get coreAudioAudioService(): CoreAudioAudioService {
        if (this._coreAudioAudioService)
            return this._coreAudioAudioService;
        else
            return this._coreAudioAudioService = new CoreAudioAudioService(this.coreAudioAudioStorage);
    }
    private _coreStartStartUseCaseStartUseCase?: CoreStartStartUseCaseStartUseCase;
    public get coreStartStartUseCaseStartUseCase(): CoreStartStartUseCaseStartUseCase {
        if (this._coreStartStartUseCaseStartUseCase)
            return this._coreStartStartUseCaseStartUseCase;
        else
            return this._coreStartStartUseCaseStartUseCase = new CoreStartStartUseCaseStartUseCase(this.coreStartStartStorage, this.coreAudioAudioService, this.coreAudioAudioStorage);
    }
    private _startControllerController?: StartControllerController;
    public get startControllerController(): StartControllerController {
        if (this._startControllerController)
            return this._startControllerController;
        else
            return this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.startAdapter, this.startControllerStartControllerBus, this.manualInjections.startControllerControllerArray);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
