// @formatter:off
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import CoreWelcomeOldHomepageUseCaseOldHomepageUseCase from 'Core/Welcome/OldHomepageUseCase/OldHomepageUseCase';
import CoreAudioAudioStorage from 'Core/Audio/AudioStorage';
import CoreAudioInputUseCaseInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioControllerAudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import CoreStartStartStorage from 'Core/Start/StartStorage';
import CoreAudioAudioService from 'Core/Audio/AudioService';
import AudioViewInputInputPresenter from 'Application/Audio/View/Input/InputPresenter';
import AudioViewAudioPresenter from 'Application/Audio/View/AudioPresenter';
import CoreAudioStateUseCaseStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import StartAdapter from 'Application/Start/Adapter';
import CoreStartStartUseCaseStartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import AudioAdapter from 'Application/Audio/Adapter';
import CoreAudioPlaybackUseCasePlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import WelcomeControllerWelcomeBus from 'Application/Welcome/Controller/WelcomeBus';
import CoreGptGeneralConversationUseCaseGeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import InfrastructureApiHelperFetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import InfrastructureParseHelper from 'Infrastructure/ParseHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import InfrastructureGptClientNetworkEncoder from 'Infrastructure/GptClient/Network/Encoder';
import CoreWelcomeStateStorage from 'Core/Welcome/StateStorage';
import StateStorage from 'Core/Welcome/StateStorage';
import CoreGptGptClient from 'Core/Gpt/GptClient';
import CoreGptConversationStorage from 'Core/Gpt/ConversationStorage';
import CoreWelcomeStateUseCaseStateUseCase from 'Core/Welcome/StateUseCase/StateUseCase';
import WelcomeViewWelcomePresenter from 'Application/Welcome/View/WelcomePresenter';
import StartViewStartPresenter from 'Application/Start/View/StartPresenter';
import StartControllerController from 'Application/Start/Controller/Controller';
import WelcomeControllerController from 'Application/Welcome/Controller/Controller';
import InfrastructureGptClientNetworkNetwork from 'Infrastructure/GptClient/Network/Network';
import WelcomeControllerHandlerConversationInputHandler from 'Application/Welcome/Controller/Handler/ConversationInputHandler';
import AudioControllerHandlerAudioInputHandler from 'Application/Audio/Controller/Handler/AudioInputHandler';
import StartControllerHandlerAudioInputHandler from 'Application/Audio/Controller/Handler/AudioInputHandler';
import AudioViewInputInput from 'Application/Audio/View/Input/Input';
import AudioInputInput from 'Application/Audio/View/Input/Input';
import AudioControllerHandlerAudioOutputHandler from 'Application/Audio/Controller/Handler/AudioOutputHandler';
import StartControllerHandlerAudioOutputHandler from 'Application/Audio/Controller/Handler/AudioOutputHandler';
import InfrastructureStorageWelcomeMemory from 'Infrastructure/Storage/Welcome/Memory';
import StartControllerHandlerStartHandler from 'Application/Start/Controller/Handler/StartHandler';
import InfrastructureGptClientFakeFake from 'Infrastructure/GptClient/Fake/Fake';
import InfrastructureGptClientFakeCasesStartCase from 'Infrastructure/GptClient/Fake/Cases/StartCase';
import InfrastructureGptClientFakeCasesMuteMicrophone from 'Infrastructure/GptClient/Fake/Cases/MuteMicrophone';
import InfrastructureGptClientFakeCasesOldHomepage from 'Infrastructure/GptClient/Fake/Cases/OldHomepage';
import AudioControllerController from 'Application/Audio/Controller/Controller';
import WelcomeControllerHandlerCommandMuteHandler from 'Application/Welcome/Controller/Handler/Command/MuteHandler';
import WelcomeControllerHandlerCommandOldHomepageHandler from 'Application/Welcome/Controller/Handler/Command/OldHomepageHandler';
import CommandHandler from 'Application/Welcome/Controller/Handler/Command/CommandHandler';
import ControllerHandler from 'Application/ControllerHandler';
import Audio from 'Application/Audio/View/Audio';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import ModuleController from 'Application/ModuleController';
import renderApplication, {Start} from 'Application/Start/View/Start';
import Welcome from 'Application/Welcome/View/Welcome';
import ViewInjection from '@enbock/ts-jsx/ViewInjection';
import ConversationMemory from 'Infrastructure/Conversation/Memory';
import StartMemory from 'Infrastructure/Storage/Start/Memory';
import AudioMemory from 'Infrastructure/Storage/Audio/Memory';
import env from '../config/env.json';
interface ManualInjections {
    welcomeControllerHandlerConversationInputHandlerArray: Array<CommandHandler>;
    audioControllerControllerArray: Array<ControllerHandler>;
    audioControllerControllerViewComponent: typeof Audio;
    infrastructureGptClientFakeFakeArray: Array<FakeCase>;
    audioViewInputInputRecognitionClass: typeof SpeechRecognition;
    startControllerControllerHandlerArray: Array<ControllerHandler>;
    welcomeControllerControllerArray: Array<ControllerHandler>;
    infrastructureGptClientNetworkNetworkServiceUrl: string;
    startControllerControllerArray: Array<ModuleController>;
    startControllerControllerView: typeof Start;
    welcomeControllerControllerViewTemplate: typeof Welcome;
    startControllerControllerInitializeApplicationView: typeof renderApplication;
    startControllerControllerDocument: Document;
    audioViewAudioPresenterSoundServiceUrl: string;
    ViewInjection: typeof ViewInjection;
    fetchHelper: FetchHelper;
    parseHelper: ParseHelper;
}
interface InterfaceInstances {
    coreWelcomeStateStorage: StateStorage;
    coreGptConversationStorage: ConversationMemory;
    coreStartStartStorage: StartMemory;
    coreAudioAudioStorage: AudioMemory;
    coreGptGptClient: CoreGptGptClient;
}
interface AdditionalResources {
    WelcomeControllerController: WelcomeControllerController;
    InfrastructureGptClientNetworkNetwork: InfrastructureGptClientNetworkNetwork;
    WelcomeControllerHandlerConversationInputHandler: WelcomeControllerHandlerConversationInputHandler;
    StartControllerHandlerAudioInputHandler: StartControllerHandlerAudioInputHandler;
    AudioInputInput: AudioInputInput;
    StartControllerHandlerAudioOutputHandler: StartControllerHandlerAudioOutputHandler;
    InfrastructureStorageWelcomeMemory: InfrastructureStorageWelcomeMemory;
    StartControllerHandlerStartHandler: StartControllerHandlerStartHandler;
    InfrastructureGptClientFakeFake: InfrastructureGptClientFakeFake;
    InfrastructureGptClientFakeCasesStartCase: InfrastructureGptClientFakeCasesStartCase;
    InfrastructureGptClientFakeCasesMuteMicrophone: InfrastructureGptClientFakeCasesMuteMicrophone;
    InfrastructureGptClientFakeCasesOldHomepage: InfrastructureGptClientFakeCasesOldHomepage;
    env: typeof env;
    AudioControllerController: AudioControllerController;
    WelcomeControllerHandlerCommandMuteHandler: WelcomeControllerHandlerCommandMuteHandler;
    WelcomeControllerHandlerCommandOldHomepageHandler: WelcomeControllerHandlerCommandOldHomepageHandler;
}
class Container {
    private manualInjections: ManualInjections = {
        startControllerControllerView: Start,
        audioControllerControllerViewComponent: Audio,
        welcomeControllerControllerViewTemplate: Welcome,
        startControllerControllerDocument: document,
        startControllerControllerInitializeApplicationView: renderApplication,
        audioViewAudioPresenterSoundServiceUrl: "https://api.itbock.de/speech",
        ViewInjection: ViewInjection,
        fetchHelper: new FetchHelper(),
        parseHelper: new ParseHelper(),
        startControllerControllerArray: [],
        infrastructureGptClientNetworkNetworkServiceUrl: "https://api.itbock.de/gpt/general",
        welcomeControllerControllerArray: [],
        startControllerControllerHandlerArray: [],
        audioViewInputInputRecognitionClass: undefined!,
        infrastructureGptClientFakeFakeArray: [],
        audioControllerControllerArray: [],
        welcomeControllerHandlerConversationInputHandlerArray: []
    };
    private interfaceInstances: InterfaceInstances = {
        coreStartStartStorage: new StartMemory(),
        coreAudioAudioStorage: new AudioMemory(),
        coreGptGptClient: undefined!,
        coreGptConversationStorage: new ConversationMemory(),
        coreWelcomeStateStorage: this.infrastructureStorageWelcomeMemory
    };
    private _welcomeControllerHandlerCommandOldHomepageHandler?: WelcomeControllerHandlerCommandOldHomepageHandler;
    private _coreAudioInputUseCaseInputUseCase?: CoreAudioInputUseCaseInputUseCase;
    private _welcomeControllerHandlerCommandMuteHandler?: WelcomeControllerHandlerCommandMuteHandler;
    private _coreAudioStateUseCaseStateUseCase?: CoreAudioStateUseCaseStateUseCase;
    private _audioViewInputInputPresenter?: AudioViewInputInputPresenter;
    private _audioViewAudioPresenter?: AudioViewAudioPresenter;
    private _audioControllerController?: AudioControllerController;
    private _infrastructureGptClientFakeCasesOldHomepage?: InfrastructureGptClientFakeCasesOldHomepage;
    private _infrastructureGptClientFakeCasesMuteMicrophone?: InfrastructureGptClientFakeCasesMuteMicrophone;
    private _infrastructureGptClientFakeCasesStartCase?: InfrastructureGptClientFakeCasesStartCase;
    private _infrastructureGptClientFakeFake?: InfrastructureGptClientFakeFake;
    private _startAdapter?: StartAdapter;
    private _startControllerHandlerStartHandler?: StartControllerHandlerStartHandler;
    private _infrastructureStorageWelcomeMemory?: InfrastructureStorageWelcomeMemory;
    private _coreAudioPlaybackUseCasePlaybackUseCase?: CoreAudioPlaybackUseCasePlaybackUseCase;
    private _audioControllerHandlerAudioOutputHandler?: AudioControllerHandlerAudioOutputHandler;
    private _audioViewInputInput?: AudioViewInputInput;
    private _audioAdapter?: AudioAdapter;
    private _audioControllerHandlerAudioInputHandler?: AudioControllerHandlerAudioInputHandler;
    private _welcomeControllerWelcomeBus?: WelcomeControllerWelcomeBus;
    private _welcomeControllerHandlerConversationInputHandler?: WelcomeControllerHandlerConversationInputHandler;
    private _infrastructureGptClientNetworkEncoder?: InfrastructureGptClientNetworkEncoder;
    private _infrastructureParseHelper?: InfrastructureParseHelper;
    private _infrastructureApiHelperFetchHelper?: InfrastructureApiHelperFetchHelper;
    private _infrastructureGptClientNetworkNetwork?: InfrastructureGptClientNetworkNetwork;
    private _welcomeViewWelcomePresenter?: WelcomeViewWelcomePresenter;
    private _coreWelcomeStateUseCaseStateUseCase?: CoreWelcomeStateUseCaseStateUseCase;
    private _coreWelcomeOldHomepageUseCaseOldHomepageUseCase?: CoreWelcomeOldHomepageUseCaseOldHomepageUseCase;
    private _audioControllerAudioControllerBus?: AudioControllerAudioControllerBus;
    private _coreAudioAudioService?: CoreAudioAudioService;
    private _coreGptGeneralConversationUseCaseGeneralConversationUseCase?: CoreGptGeneralConversationUseCaseGeneralConversationUseCase;
    private _welcomeControllerController?: WelcomeControllerController;
    private _startViewStartPresenter?: StartViewStartPresenter;
    private _coreStartStartUseCaseStartUseCase?: CoreStartStartUseCaseStartUseCase;
    private _startControllerController?: StartControllerController;

    constructor() {
        function getEnv(key: string): string {
            return (env as any)[key] || "";
        }
        this.manualInjections.infrastructureGptClientFakeFakeArray.push(
            this.infrastructureGptClientFakeCasesStartCase,
            this.infrastructureGptClientFakeCasesMuteMicrophone,
            this.infrastructureGptClientFakeCasesOldHomepage
        );
        this.interfaceInstances.coreGptGptClient = getEnv("FAKE") ? this.infrastructureGptClientFakeFake : this.infrastructureGptClientNetworkNetwork;
        this.manualInjections.welcomeControllerControllerArray = [
            this.welcomeControllerHandlerConversationInputHandler
        ];
        this.manualInjections.startControllerControllerHandlerArray.push(
            this.startControllerHandlerStartHandler
            );
        this.manualInjections.startControllerControllerArray.push(
            this.welcomeControllerController
        );
        this.manualInjections.audioControllerControllerArray.push(
            this.audioControllerHandlerAudioInputHandler,
            this.audioControllerHandlerAudioOutputHandler
        );
        this.manualInjections.welcomeControllerHandlerConversationInputHandlerArray.push(
            this.welcomeControllerHandlerCommandOldHomepageHandler,
            this.welcomeControllerHandlerCommandMuteHandler
        );
        this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.manualInjections.startControllerControllerHandlerArray);
        const LocalSpeechRecognition = (window as any)["SpeechRecognition"] || (window as any)["webkitSpeechRecognition"] || (window as any)["speechRecognition"];
        this.manualInjections.audioViewInputInputRecognitionClass = LocalSpeechRecognition;
        this.audioControllerController;
        ViewInjection(Start, this.startAdapter);
        ViewInjection(Audio, this.audioAdapter, this.audioViewInputInput);
        ViewInjection(Welcome);
    }

    public get coreWelcomeStateStorage(): CoreWelcomeStateStorage {
        return this.interfaceInstances.coreWelcomeStateStorage;
    }

    public get coreGptConversationStorage(): CoreGptConversationStorage {
        return this.interfaceInstances.coreGptConversationStorage;
    }

    public get coreAudioAudioStorage(): CoreAudioAudioStorage {
        return this.interfaceInstances.coreAudioAudioStorage;
    }

    public get coreGptGptClient(): CoreGptGptClient {
        return this.interfaceInstances.coreGptGptClient;
    }

    public get coreStartStartStorage(): CoreStartStartStorage {
        return this.interfaceInstances.coreStartStartStorage;
    }

    public get welcomeControllerHandlerCommandOldHomepageHandler(): WelcomeControllerHandlerCommandOldHomepageHandler {
        if (this._welcomeControllerHandlerCommandOldHomepageHandler)
            return this._welcomeControllerHandlerCommandOldHomepageHandler;
        else
            return this._welcomeControllerHandlerCommandOldHomepageHandler = new WelcomeControllerHandlerCommandOldHomepageHandler(this.coreWelcomeOldHomepageUseCaseOldHomepageUseCase);
    }

    public get coreAudioInputUseCaseInputUseCase(): CoreAudioInputUseCaseInputUseCase {
        if (this._coreAudioInputUseCaseInputUseCase)
            return this._coreAudioInputUseCaseInputUseCase;
        else
            return this._coreAudioInputUseCaseInputUseCase = new CoreAudioInputUseCaseInputUseCase(this.coreAudioAudioStorage);
    }

    public get welcomeControllerHandlerCommandMuteHandler(): WelcomeControllerHandlerCommandMuteHandler {
        if (this._welcomeControllerHandlerCommandMuteHandler)
            return this._welcomeControllerHandlerCommandMuteHandler;
        else
            return this._welcomeControllerHandlerCommandMuteHandler = new WelcomeControllerHandlerCommandMuteHandler(this.coreAudioInputUseCaseInputUseCase, this.audioControllerAudioControllerBus);
    }

    public get coreAudioStateUseCaseStateUseCase(): CoreAudioStateUseCaseStateUseCase {
        if (this._coreAudioStateUseCaseStateUseCase)
            return this._coreAudioStateUseCaseStateUseCase;
        else
            return this._coreAudioStateUseCaseStateUseCase = new CoreAudioStateUseCaseStateUseCase(this.coreStartStartStorage, this.coreAudioAudioService, this.coreAudioAudioStorage);
    }

    public get audioViewInputInputPresenter(): AudioViewInputInputPresenter {
        if (this._audioViewInputInputPresenter)
            return this._audioViewInputInputPresenter;
        else
            return this._audioViewInputInputPresenter = new AudioViewInputInputPresenter();
    }

    public get audioViewAudioPresenter(): AudioViewAudioPresenter {
        if (this._audioViewAudioPresenter)
            return this._audioViewAudioPresenter;
        else
            return this._audioViewAudioPresenter = new AudioViewAudioPresenter(this.manualInjections.audioViewAudioPresenterSoundServiceUrl, this.audioViewInputInputPresenter);
    }

    public get audioControllerController(): AudioControllerController {
        if (this._audioControllerController)
            return this._audioControllerController;
        else
            return this._audioControllerController = new AudioControllerController(this.manualInjections.audioControllerControllerViewComponent, this.audioViewAudioPresenter, this.manualInjections.audioControllerControllerArray, this.coreAudioStateUseCaseStateUseCase, this.audioControllerAudioControllerBus);
    }

    public get infrastructureGptClientFakeCasesOldHomepage(): InfrastructureGptClientFakeCasesOldHomepage {
        if (this._infrastructureGptClientFakeCasesOldHomepage)
            return this._infrastructureGptClientFakeCasesOldHomepage;
        else
            return this._infrastructureGptClientFakeCasesOldHomepage = new InfrastructureGptClientFakeCasesOldHomepage();
    }

    public get infrastructureGptClientFakeCasesMuteMicrophone(): InfrastructureGptClientFakeCasesMuteMicrophone {
        if (this._infrastructureGptClientFakeCasesMuteMicrophone)
            return this._infrastructureGptClientFakeCasesMuteMicrophone;
        else
            return this._infrastructureGptClientFakeCasesMuteMicrophone = new InfrastructureGptClientFakeCasesMuteMicrophone();
    }

    public get infrastructureGptClientFakeCasesStartCase(): InfrastructureGptClientFakeCasesStartCase {
        if (this._infrastructureGptClientFakeCasesStartCase)
            return this._infrastructureGptClientFakeCasesStartCase;
        else
            return this._infrastructureGptClientFakeCasesStartCase = new InfrastructureGptClientFakeCasesStartCase();
    }

    public get infrastructureGptClientFakeFake(): InfrastructureGptClientFakeFake {
        if (this._infrastructureGptClientFakeFake)
            return this._infrastructureGptClientFakeFake;
        else
            return this._infrastructureGptClientFakeFake = new InfrastructureGptClientFakeFake(this.manualInjections.infrastructureGptClientFakeFakeArray);
    }

    public get startAdapter(): StartAdapter {
        if (this._startAdapter)
            return this._startAdapter;
        else
            return this._startAdapter = new StartAdapter();
    }

    public get startControllerHandlerStartHandler(): StartControllerHandlerStartHandler {
        if (this._startControllerHandlerStartHandler)
            return this._startControllerHandlerStartHandler;
        else
            return this._startControllerHandlerStartHandler = new StartControllerHandlerStartHandler(this.startAdapter, this.coreStartStartUseCaseStartUseCase, this.audioControllerAudioControllerBus);
    }

    public get infrastructureStorageWelcomeMemory(): InfrastructureStorageWelcomeMemory {
        if (this._infrastructureStorageWelcomeMemory)
            return this._infrastructureStorageWelcomeMemory;
        else
            return this._infrastructureStorageWelcomeMemory = new InfrastructureStorageWelcomeMemory();
    }

    public get coreAudioPlaybackUseCasePlaybackUseCase(): CoreAudioPlaybackUseCasePlaybackUseCase {
        if (this._coreAudioPlaybackUseCasePlaybackUseCase)
            return this._coreAudioPlaybackUseCasePlaybackUseCase;
        else
            return this._coreAudioPlaybackUseCasePlaybackUseCase = new CoreAudioPlaybackUseCasePlaybackUseCase(this.coreAudioAudioStorage);
    }

    public get audioControllerHandlerAudioOutputHandler(): AudioControllerHandlerAudioOutputHandler {
        if (this._audioControllerHandlerAudioOutputHandler)
            return this._audioControllerHandlerAudioOutputHandler;
        else
            return this._audioControllerHandlerAudioOutputHandler = new AudioControllerHandlerAudioOutputHandler(this.audioAdapter, this.coreAudioPlaybackUseCasePlaybackUseCase);
    }

    public get audioViewInputInput(): AudioViewInputInput {
        if (this._audioViewInputInput)
            return this._audioViewInputInput;
        else
            return this._audioViewInputInput = new AudioViewInputInput(this.manualInjections.audioViewInputInputRecognitionClass, this.audioAdapter);
    }

    public get audioAdapter(): AudioAdapter {
        if (this._audioAdapter)
            return this._audioAdapter;
        else
            return this._audioAdapter = new AudioAdapter();
    }

    public get audioControllerHandlerAudioInputHandler(): AudioControllerHandlerAudioInputHandler {
        if (this._audioControllerHandlerAudioInputHandler)
            return this._audioControllerHandlerAudioInputHandler;
        else
            return this._audioControllerHandlerAudioInputHandler = new AudioControllerHandlerAudioInputHandler(this.audioAdapter, this.welcomeControllerWelcomeBus);
    }

    public get welcomeControllerWelcomeBus(): WelcomeControllerWelcomeBus {
        if (this._welcomeControllerWelcomeBus)
            return this._welcomeControllerWelcomeBus;
        else
            return this._welcomeControllerWelcomeBus = new WelcomeControllerWelcomeBus();
    }

    public get welcomeControllerHandlerConversationInputHandler(): WelcomeControllerHandlerConversationInputHandler {
        if (this._welcomeControllerHandlerConversationInputHandler)
            return this._welcomeControllerHandlerConversationInputHandler;
        else
            return this._welcomeControllerHandlerConversationInputHandler = new WelcomeControllerHandlerConversationInputHandler(this.welcomeControllerWelcomeBus, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.manualInjections.welcomeControllerHandlerConversationInputHandlerArray);
    }

    public get infrastructureGptClientNetworkEncoder(): InfrastructureGptClientNetworkEncoder {
        if (this._infrastructureGptClientNetworkEncoder)
            return this._infrastructureGptClientNetworkEncoder;
        else
            return this._infrastructureGptClientNetworkEncoder = new InfrastructureGptClientNetworkEncoder();
    }

    public get infrastructureParseHelper(): InfrastructureParseHelper {
        if (this._infrastructureParseHelper)
            return this._infrastructureParseHelper;
        else
            return this._infrastructureParseHelper = new InfrastructureParseHelper();
    }

    public get infrastructureApiHelperFetchHelper(): InfrastructureApiHelperFetchHelper {
        if (this._infrastructureApiHelperFetchHelper)
            return this._infrastructureApiHelperFetchHelper;
        else
            return this._infrastructureApiHelperFetchHelper = new InfrastructureApiHelperFetchHelper();
    }

    public get infrastructureGptClientNetworkNetwork(): InfrastructureGptClientNetworkNetwork {
        if (this._infrastructureGptClientNetworkNetwork)
            return this._infrastructureGptClientNetworkNetwork;
        else
            return this._infrastructureGptClientNetworkNetwork = new InfrastructureGptClientNetworkNetwork(this.infrastructureApiHelperFetchHelper, this.infrastructureParseHelper, this.manualInjections.infrastructureGptClientNetworkNetworkServiceUrl, this.infrastructureGptClientNetworkEncoder);
    }

    public get welcomeViewWelcomePresenter(): WelcomeViewWelcomePresenter {
        if (this._welcomeViewWelcomePresenter)
            return this._welcomeViewWelcomePresenter;
        else
            return this._welcomeViewWelcomePresenter = new WelcomeViewWelcomePresenter();
    }

    public get coreWelcomeStateUseCaseStateUseCase(): CoreWelcomeStateUseCaseStateUseCase {
        if (this._coreWelcomeStateUseCaseStateUseCase)
            return this._coreWelcomeStateUseCaseStateUseCase;
        else
            return this._coreWelcomeStateUseCaseStateUseCase = new CoreWelcomeStateUseCaseStateUseCase(this.coreWelcomeStateStorage);
    }

    public get coreWelcomeOldHomepageUseCaseOldHomepageUseCase(): CoreWelcomeOldHomepageUseCaseOldHomepageUseCase {
        if (this._coreWelcomeOldHomepageUseCaseOldHomepageUseCase)
            return this._coreWelcomeOldHomepageUseCaseOldHomepageUseCase;
        else
            return this._coreWelcomeOldHomepageUseCaseOldHomepageUseCase = new CoreWelcomeOldHomepageUseCaseOldHomepageUseCase(this.coreWelcomeStateStorage);
    }

    public get audioControllerAudioControllerBus(): AudioControllerAudioControllerBus {
        if (this._audioControllerAudioControllerBus)
            return this._audioControllerAudioControllerBus;
        else
            return this._audioControllerAudioControllerBus = new AudioControllerAudioControllerBus();
    }

    public get coreAudioAudioService(): CoreAudioAudioService {
        if (this._coreAudioAudioService)
            return this._coreAudioAudioService;
        else
            return this._coreAudioAudioService = new CoreAudioAudioService(this.coreAudioAudioStorage);
    }

    public get coreGptGeneralConversationUseCaseGeneralConversationUseCase(): CoreGptGeneralConversationUseCaseGeneralConversationUseCase {
        if (this._coreGptGeneralConversationUseCaseGeneralConversationUseCase)
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase;
        else
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase = new CoreGptGeneralConversationUseCaseGeneralConversationUseCase(this.coreGptGptClient, this.coreAudioAudioService, this.coreGptConversationStorage);
    }

    public get welcomeControllerController(): WelcomeControllerController {
        if (this._welcomeControllerController)
            return this._welcomeControllerController;
        else
            return this._welcomeControllerController = new WelcomeControllerController(this.manualInjections.welcomeControllerControllerViewTemplate, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.audioControllerAudioControllerBus, this.manualInjections.welcomeControllerControllerArray, this.coreWelcomeOldHomepageUseCaseOldHomepageUseCase, this.coreWelcomeStateUseCaseStateUseCase, this.welcomeViewWelcomePresenter);
    }

    public get startViewStartPresenter(): StartViewStartPresenter {
        if (this._startViewStartPresenter)
            return this._startViewStartPresenter;
        else
            return this._startViewStartPresenter = new StartViewStartPresenter();
    }

    public get coreStartStartUseCaseStartUseCase(): CoreStartStartUseCaseStartUseCase {
        if (this._coreStartStartUseCaseStartUseCase)
            return this._coreStartStartUseCaseStartUseCase;
        else
            return this._coreStartStartUseCaseStartUseCase = new CoreStartStartUseCaseStartUseCase(this.coreStartStartStorage);
    }

    public get startControllerController(): StartControllerController {
        if (this._startControllerController)
            return this._startControllerController;
        else
            return this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.manualInjections.startControllerControllerArray);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
