// @formatter:off
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import CoreAudioInputUseCaseInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import CoreGptConversationResetUseCaseConversationResetUseCase from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';
import CoreWelcomeOldHomepageUseCaseOldHomepageUseCase from 'Core/Welcome/OldHomepageUseCase/OldHomepageUseCase';
import CoreGptConversationStorage from 'Core/Gpt/ConversationStorage';
import AudioControllerAudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import AudioViewInputInputPresenter from 'Application/Audio/View/Input/InputPresenter';
import AudioViewAudioPresenter from 'Application/Audio/View/AudioPresenter';
import CoreAudioStateUseCaseStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import StartAdapter from 'Application/Start/Adapter';
import CoreStartStartUseCaseStartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import CoreAudioAudioStorage from 'Core/Audio/AudioStorage';
import AudioAdapter from 'Application/Audio/Adapter';
import CoreAudioPlaybackUseCasePlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import StartControllerStartControllerBus from 'Application/Start/Controller/StartControllerBus';
import CoreGptGeneralConversationUseCaseGeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import InfrastructureApiHelperFetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import InfrastructureParseHelper from 'Infrastructure/ParseHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import InfrastructureGptClientNetworkEncoder from 'Infrastructure/GptClient/Network/Encoder';
import CoreWelcomeStateStorage from 'Core/Welcome/StateStorage';
import StateStorage from 'Core/Welcome/StateStorage';
import CoreGptGptClient from 'Core/Gpt/GptClient';
import CoreAudioAudioService from 'Core/Audio/AudioService';
import CoreWelcomeStateUseCaseStateUseCase from 'Core/Welcome/StateUseCase/StateUseCase';
import WelcomeViewWelcomePresenter from 'Application/Welcome/View/WelcomePresenter';
import CoreStartStartStorage from 'Core/Start/StartStorage';
import CoreGptStateUseCaseStateUseCase from 'Core/Gpt/StateUseCase/StateUseCase';
import StartViewStartPresenter from 'Application/Start/View/StartPresenter';
import StartControllerDataCollector from 'Application/Start/Controller/DataCollector';
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
import AudioControllerHandlerCommandSuspendCommand from 'Application/Audio/Controller/Handler/Command/SuspendCommand';
import InfrastructureGptClientFakeCasesEndOfTopicCase from 'Infrastructure/GptClient/Fake/Cases/EndOfTopicCase';
import WelcomeControllerHandlerCommandSuspendCommand from 'Application/Welcome/Controller/Handler/Command/SuspendCommand';
import AudioControllerHandlerStandbyReceiver from 'Application/Audio/Controller/Handler/StandbyReceiver';
import AudioInputReceiverHandler from 'Application/Audio/Controller/Handler/AudioInputReceiverHandler';
import CommandHandler from 'Application/Command/CommandHandler';
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
    coreAudioInputUseCaseInputUseCaseArray: Array<string>;
    audioControllerHandlerAudioInputHandlerArray: Array<AudioInputReceiverHandler>;
    welcomeControllerHandlerConversationInputHandlerArray: Array<CommandHandler>;
    audioControllerControllerArray: Array<ControllerHandler>;
    audioControllerControllerViewComponent: typeof Audio;
    infrastructureGptClientFakeFakeArray: Array<FakeCase>;
    audioViewInputInputRecognitionClass: typeof SpeechRecognition;
    startControllerControllerArrayHandler: Array<ControllerHandler>;
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
    AudioControllerHandlerCommandSuspendCommand: AudioControllerHandlerCommandSuspendCommand;
    InfrastructureGptClientFakeCasesEndOfTopicCase: InfrastructureGptClientFakeCasesEndOfTopicCase;
    WelcomeControllerHandlerCommandSuspendCommand: WelcomeControllerHandlerCommandSuspendCommand;
    AudioControllerHandlerStandbyReceiver: AudioControllerHandlerStandbyReceiver;
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
        startControllerControllerArrayHandler: [],
        audioViewInputInputRecognitionClass: undefined!,
        infrastructureGptClientFakeFakeArray: [],
        audioControllerControllerArray: [],
        welcomeControllerHandlerConversationInputHandlerArray: [],
        audioControllerHandlerAudioInputHandlerArray: [],
        coreAudioInputUseCaseInputUseCaseArray: [
            "computer",
            "terminal"
        ]
    };
    private interfaceInstances: InterfaceInstances = {
        coreStartStartStorage: new StartMemory(),
        coreAudioAudioStorage: new AudioMemory(),
        coreGptGptClient: undefined!,
        coreGptConversationStorage: new ConversationMemory(),
        coreWelcomeStateStorage: this.infrastructureStorageWelcomeMemory
    };
    constructor() {
        function getEnv(key: string): string {
            return (env as any)[key] || "";
        }
        this.manualInjections.infrastructureGptClientFakeFakeArray.push(this.infrastructureGptClientFakeCasesStartCase, this.infrastructureGptClientFakeCasesMuteMicrophone, this.infrastructureGptClientFakeCasesOldHomepage, this.infrastructureGptClientFakeCasesEndOfTopicCase);
        this.interfaceInstances.coreGptGptClient = getEnv("FAKE") ? this.infrastructureGptClientFakeFake : this.infrastructureGptClientNetworkNetwork;
        this.manualInjections.welcomeControllerControllerArray.push(this.welcomeControllerHandlerConversationInputHandler);
        this.manualInjections.startControllerControllerArrayHandler.push(this.startControllerHandlerStartHandler);
        this.manualInjections.startControllerControllerArray.push(this.welcomeControllerController);
        this.manualInjections.audioControllerControllerArray.push(this.audioControllerHandlerAudioInputHandler, this.audioControllerHandlerAudioOutputHandler);
        this.manualInjections.welcomeControllerHandlerConversationInputHandlerArray.push(this.welcomeControllerHandlerCommandOldHomepageHandler, this.welcomeControllerHandlerCommandMuteHandler, this.audioControllerHandlerCommandSuspendCommand, this.welcomeControllerHandlerCommandSuspendCommand);
        this.manualInjections.audioControllerHandlerAudioInputHandlerArray.push(this.audioControllerHandlerStandbyReceiver, this.welcomeControllerHandlerConversationInputHandler);
        this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.manualInjections.startControllerControllerArrayHandler, this.startControllerStartControllerBus, this.startControllerDataCollector);
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
    public get coreGptGptClient(): CoreGptGptClient {
        return this.interfaceInstances.coreGptGptClient;
    }
    public get coreAudioAudioStorage(): CoreAudioAudioStorage {
        return this.interfaceInstances.coreAudioAudioStorage;
    }
    public get coreGptConversationStorage(): CoreGptConversationStorage {
        return this.interfaceInstances.coreGptConversationStorage;
    }
    public get coreStartStartStorage(): CoreStartStartStorage {
        return this.interfaceInstances.coreStartStartStorage;
    }
    private _audioControllerHandlerStandbyReceiver?: AudioControllerHandlerStandbyReceiver;
    public get audioControllerHandlerStandbyReceiver(): AudioControllerHandlerStandbyReceiver {
        if (this._audioControllerHandlerStandbyReceiver)
            return this._audioControllerHandlerStandbyReceiver;
        else
            return this._audioControllerHandlerStandbyReceiver = new AudioControllerHandlerStandbyReceiver(this.coreAudioInputUseCaseInputUseCase);
    }
    private _welcomeControllerHandlerCommandSuspendCommand?: WelcomeControllerHandlerCommandSuspendCommand;
    public get welcomeControllerHandlerCommandSuspendCommand(): WelcomeControllerHandlerCommandSuspendCommand {
        if (this._welcomeControllerHandlerCommandSuspendCommand)
            return this._welcomeControllerHandlerCommandSuspendCommand;
        else
            return this._welcomeControllerHandlerCommandSuspendCommand = new WelcomeControllerHandlerCommandSuspendCommand(this.coreGptConversationResetUseCaseConversationResetUseCase);
    }
    private _infrastructureGptClientFakeCasesEndOfTopicCase?: InfrastructureGptClientFakeCasesEndOfTopicCase;
    public get infrastructureGptClientFakeCasesEndOfTopicCase(): InfrastructureGptClientFakeCasesEndOfTopicCase {
        if (this._infrastructureGptClientFakeCasesEndOfTopicCase)
            return this._infrastructureGptClientFakeCasesEndOfTopicCase;
        else
            return this._infrastructureGptClientFakeCasesEndOfTopicCase = new InfrastructureGptClientFakeCasesEndOfTopicCase();
    }
    private _audioControllerHandlerCommandSuspendCommand?: AudioControllerHandlerCommandSuspendCommand;
    public get audioControllerHandlerCommandSuspendCommand(): AudioControllerHandlerCommandSuspendCommand {
        if (this._audioControllerHandlerCommandSuspendCommand)
            return this._audioControllerHandlerCommandSuspendCommand;
        else
            return this._audioControllerHandlerCommandSuspendCommand = new AudioControllerHandlerCommandSuspendCommand(this.coreAudioInputUseCaseInputUseCase);
    }
    private _welcomeControllerHandlerCommandOldHomepageHandler?: WelcomeControllerHandlerCommandOldHomepageHandler;
    public get welcomeControllerHandlerCommandOldHomepageHandler(): WelcomeControllerHandlerCommandOldHomepageHandler {
        if (this._welcomeControllerHandlerCommandOldHomepageHandler)
            return this._welcomeControllerHandlerCommandOldHomepageHandler;
        else
            return this._welcomeControllerHandlerCommandOldHomepageHandler = new WelcomeControllerHandlerCommandOldHomepageHandler(this.coreWelcomeOldHomepageUseCaseOldHomepageUseCase);
    }
    private _coreGptConversationResetUseCaseConversationResetUseCase?: CoreGptConversationResetUseCaseConversationResetUseCase;
    public get coreGptConversationResetUseCaseConversationResetUseCase(): CoreGptConversationResetUseCaseConversationResetUseCase {
        if (this._coreGptConversationResetUseCaseConversationResetUseCase)
            return this._coreGptConversationResetUseCaseConversationResetUseCase;
        else
            return this._coreGptConversationResetUseCaseConversationResetUseCase = new CoreGptConversationResetUseCaseConversationResetUseCase(this.coreGptConversationStorage);
    }
    private _welcomeControllerHandlerCommandMuteHandler?: WelcomeControllerHandlerCommandMuteHandler;
    public get welcomeControllerHandlerCommandMuteHandler(): WelcomeControllerHandlerCommandMuteHandler {
        if (this._welcomeControllerHandlerCommandMuteHandler)
            return this._welcomeControllerHandlerCommandMuteHandler;
        else
            return this._welcomeControllerHandlerCommandMuteHandler = new WelcomeControllerHandlerCommandMuteHandler(this.coreAudioInputUseCaseInputUseCase, this.audioControllerAudioControllerBus, this.coreGptConversationResetUseCaseConversationResetUseCase);
    }
    private _audioViewInputInputPresenter?: AudioViewInputInputPresenter;
    public get audioViewInputInputPresenter(): AudioViewInputInputPresenter {
        if (this._audioViewInputInputPresenter)
            return this._audioViewInputInputPresenter;
        else
            return this._audioViewInputInputPresenter = new AudioViewInputInputPresenter();
    }
    private _audioViewAudioPresenter?: AudioViewAudioPresenter;
    public get audioViewAudioPresenter(): AudioViewAudioPresenter {
        if (this._audioViewAudioPresenter)
            return this._audioViewAudioPresenter;
        else
            return this._audioViewAudioPresenter = new AudioViewAudioPresenter(this.manualInjections.audioViewAudioPresenterSoundServiceUrl, this.audioViewInputInputPresenter);
    }
    private _audioControllerController?: AudioControllerController;
    public get audioControllerController(): AudioControllerController {
        if (this._audioControllerController)
            return this._audioControllerController;
        else
            return this._audioControllerController = new AudioControllerController(this.manualInjections.audioControllerControllerViewComponent, this.audioViewAudioPresenter, this.manualInjections.audioControllerControllerArray, this.coreAudioStateUseCaseStateUseCase, this.audioControllerAudioControllerBus);
    }
    private _infrastructureGptClientFakeCasesOldHomepage?: InfrastructureGptClientFakeCasesOldHomepage;
    public get infrastructureGptClientFakeCasesOldHomepage(): InfrastructureGptClientFakeCasesOldHomepage {
        if (this._infrastructureGptClientFakeCasesOldHomepage)
            return this._infrastructureGptClientFakeCasesOldHomepage;
        else
            return this._infrastructureGptClientFakeCasesOldHomepage = new InfrastructureGptClientFakeCasesOldHomepage();
    }
    private _infrastructureGptClientFakeCasesMuteMicrophone?: InfrastructureGptClientFakeCasesMuteMicrophone;
    public get infrastructureGptClientFakeCasesMuteMicrophone(): InfrastructureGptClientFakeCasesMuteMicrophone {
        if (this._infrastructureGptClientFakeCasesMuteMicrophone)
            return this._infrastructureGptClientFakeCasesMuteMicrophone;
        else
            return this._infrastructureGptClientFakeCasesMuteMicrophone = new InfrastructureGptClientFakeCasesMuteMicrophone();
    }
    private _infrastructureGptClientFakeCasesStartCase?: InfrastructureGptClientFakeCasesStartCase;
    public get infrastructureGptClientFakeCasesStartCase(): InfrastructureGptClientFakeCasesStartCase {
        if (this._infrastructureGptClientFakeCasesStartCase)
            return this._infrastructureGptClientFakeCasesStartCase;
        else
            return this._infrastructureGptClientFakeCasesStartCase = new InfrastructureGptClientFakeCasesStartCase();
    }
    private _infrastructureGptClientFakeFake?: InfrastructureGptClientFakeFake;
    public get infrastructureGptClientFakeFake(): InfrastructureGptClientFakeFake {
        if (this._infrastructureGptClientFakeFake)
            return this._infrastructureGptClientFakeFake;
        else
            return this._infrastructureGptClientFakeFake = new InfrastructureGptClientFakeFake(this.manualInjections.infrastructureGptClientFakeFakeArray);
    }
    private _startAdapter?: StartAdapter;
    public get startAdapter(): StartAdapter {
        if (this._startAdapter)
            return this._startAdapter;
        else
            return this._startAdapter = new StartAdapter();
    }
    private _startControllerHandlerStartHandler?: StartControllerHandlerStartHandler;
    public get startControllerHandlerStartHandler(): StartControllerHandlerStartHandler {
        if (this._startControllerHandlerStartHandler)
            return this._startControllerHandlerStartHandler;
        else
            return this._startControllerHandlerStartHandler = new StartControllerHandlerStartHandler(this.startAdapter, this.coreStartStartUseCaseStartUseCase, this.audioControllerAudioControllerBus);
    }
    private _infrastructureStorageWelcomeMemory?: InfrastructureStorageWelcomeMemory;
    public get infrastructureStorageWelcomeMemory(): InfrastructureStorageWelcomeMemory {
        if (this._infrastructureStorageWelcomeMemory)
            return this._infrastructureStorageWelcomeMemory;
        else
            return this._infrastructureStorageWelcomeMemory = new InfrastructureStorageWelcomeMemory();
    }
    private _coreAudioPlaybackUseCasePlaybackUseCase?: CoreAudioPlaybackUseCasePlaybackUseCase;
    public get coreAudioPlaybackUseCasePlaybackUseCase(): CoreAudioPlaybackUseCasePlaybackUseCase {
        if (this._coreAudioPlaybackUseCasePlaybackUseCase)
            return this._coreAudioPlaybackUseCasePlaybackUseCase;
        else
            return this._coreAudioPlaybackUseCasePlaybackUseCase = new CoreAudioPlaybackUseCasePlaybackUseCase(this.coreAudioAudioStorage);
    }
    private _audioControllerHandlerAudioOutputHandler?: AudioControllerHandlerAudioOutputHandler;
    public get audioControllerHandlerAudioOutputHandler(): AudioControllerHandlerAudioOutputHandler {
        if (this._audioControllerHandlerAudioOutputHandler)
            return this._audioControllerHandlerAudioOutputHandler;
        else
            return this._audioControllerHandlerAudioOutputHandler = new AudioControllerHandlerAudioOutputHandler(this.audioAdapter, this.coreAudioPlaybackUseCasePlaybackUseCase, this.startControllerStartControllerBus);
    }
    private _audioViewInputInput?: AudioViewInputInput;
    public get audioViewInputInput(): AudioViewInputInput {
        if (this._audioViewInputInput)
            return this._audioViewInputInput;
        else
            return this._audioViewInputInput = new AudioViewInputInput(this.manualInjections.audioViewInputInputRecognitionClass, this.audioAdapter);
    }
    private _coreAudioInputUseCaseInputUseCase?: CoreAudioInputUseCaseInputUseCase;
    public get coreAudioInputUseCaseInputUseCase(): CoreAudioInputUseCaseInputUseCase {
        if (this._coreAudioInputUseCaseInputUseCase)
            return this._coreAudioInputUseCaseInputUseCase;
        else
            return this._coreAudioInputUseCaseInputUseCase = new CoreAudioInputUseCaseInputUseCase(this.coreAudioAudioStorage, this.manualInjections.coreAudioInputUseCaseInputUseCaseArray);
    }
    private _audioAdapter?: AudioAdapter;
    public get audioAdapter(): AudioAdapter {
        if (this._audioAdapter)
            return this._audioAdapter;
        else
            return this._audioAdapter = new AudioAdapter();
    }
    private _audioControllerHandlerAudioInputHandler?: AudioControllerHandlerAudioInputHandler;
    public get audioControllerHandlerAudioInputHandler(): AudioControllerHandlerAudioInputHandler {
        if (this._audioControllerHandlerAudioInputHandler)
            return this._audioControllerHandlerAudioInputHandler;
        else
            return this._audioControllerHandlerAudioInputHandler = new AudioControllerHandlerAudioInputHandler(this.audioAdapter, this.coreAudioInputUseCaseInputUseCase, this.manualInjections.audioControllerHandlerAudioInputHandlerArray);
    }
    private _welcomeControllerHandlerConversationInputHandler?: WelcomeControllerHandlerConversationInputHandler;
    public get welcomeControllerHandlerConversationInputHandler(): WelcomeControllerHandlerConversationInputHandler {
        if (this._welcomeControllerHandlerConversationInputHandler)
            return this._welcomeControllerHandlerConversationInputHandler;
        else
            return this._welcomeControllerHandlerConversationInputHandler = new WelcomeControllerHandlerConversationInputHandler(this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.manualInjections.welcomeControllerHandlerConversationInputHandlerArray);
    }
    private _infrastructureGptClientNetworkEncoder?: InfrastructureGptClientNetworkEncoder;
    public get infrastructureGptClientNetworkEncoder(): InfrastructureGptClientNetworkEncoder {
        if (this._infrastructureGptClientNetworkEncoder)
            return this._infrastructureGptClientNetworkEncoder;
        else
            return this._infrastructureGptClientNetworkEncoder = new InfrastructureGptClientNetworkEncoder();
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
    private _infrastructureGptClientNetworkNetwork?: InfrastructureGptClientNetworkNetwork;
    public get infrastructureGptClientNetworkNetwork(): InfrastructureGptClientNetworkNetwork {
        if (this._infrastructureGptClientNetworkNetwork)
            return this._infrastructureGptClientNetworkNetwork;
        else
            return this._infrastructureGptClientNetworkNetwork = new InfrastructureGptClientNetworkNetwork(this.infrastructureApiHelperFetchHelper, this.infrastructureParseHelper, this.manualInjections.infrastructureGptClientNetworkNetworkServiceUrl, this.infrastructureGptClientNetworkEncoder);
    }
    private _welcomeViewWelcomePresenter?: WelcomeViewWelcomePresenter;
    public get welcomeViewWelcomePresenter(): WelcomeViewWelcomePresenter {
        if (this._welcomeViewWelcomePresenter)
            return this._welcomeViewWelcomePresenter;
        else
            return this._welcomeViewWelcomePresenter = new WelcomeViewWelcomePresenter();
    }
    private _coreWelcomeStateUseCaseStateUseCase?: CoreWelcomeStateUseCaseStateUseCase;
    public get coreWelcomeStateUseCaseStateUseCase(): CoreWelcomeStateUseCaseStateUseCase {
        if (this._coreWelcomeStateUseCaseStateUseCase)
            return this._coreWelcomeStateUseCaseStateUseCase;
        else
            return this._coreWelcomeStateUseCaseStateUseCase = new CoreWelcomeStateUseCaseStateUseCase(this.coreWelcomeStateStorage);
    }
    private _coreWelcomeOldHomepageUseCaseOldHomepageUseCase?: CoreWelcomeOldHomepageUseCaseOldHomepageUseCase;
    public get coreWelcomeOldHomepageUseCaseOldHomepageUseCase(): CoreWelcomeOldHomepageUseCaseOldHomepageUseCase {
        if (this._coreWelcomeOldHomepageUseCaseOldHomepageUseCase)
            return this._coreWelcomeOldHomepageUseCaseOldHomepageUseCase;
        else
            return this._coreWelcomeOldHomepageUseCaseOldHomepageUseCase = new CoreWelcomeOldHomepageUseCaseOldHomepageUseCase(this.coreWelcomeStateStorage);
    }
    private _audioControllerAudioControllerBus?: AudioControllerAudioControllerBus;
    public get audioControllerAudioControllerBus(): AudioControllerAudioControllerBus {
        if (this._audioControllerAudioControllerBus)
            return this._audioControllerAudioControllerBus;
        else
            return this._audioControllerAudioControllerBus = new AudioControllerAudioControllerBus();
    }
    private _coreGptGeneralConversationUseCaseGeneralConversationUseCase?: CoreGptGeneralConversationUseCaseGeneralConversationUseCase;
    public get coreGptGeneralConversationUseCaseGeneralConversationUseCase(): CoreGptGeneralConversationUseCaseGeneralConversationUseCase {
        if (this._coreGptGeneralConversationUseCaseGeneralConversationUseCase)
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase;
        else
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase = new CoreGptGeneralConversationUseCaseGeneralConversationUseCase(this.coreGptGptClient, this.coreAudioAudioService, this.coreGptConversationStorage);
    }
    private _welcomeControllerController?: WelcomeControllerController;
    public get welcomeControllerController(): WelcomeControllerController {
        if (this._welcomeControllerController)
            return this._welcomeControllerController;
        else
            return this._welcomeControllerController = new WelcomeControllerController(this.manualInjections.welcomeControllerControllerViewTemplate, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.audioControllerAudioControllerBus, this.manualInjections.welcomeControllerControllerArray, this.coreWelcomeOldHomepageUseCaseOldHomepageUseCase, this.coreWelcomeStateUseCaseStateUseCase, this.welcomeViewWelcomePresenter, this.startControllerStartControllerBus);
    }
    private _coreAudioAudioService?: CoreAudioAudioService;
    public get coreAudioAudioService(): CoreAudioAudioService {
        if (this._coreAudioAudioService)
            return this._coreAudioAudioService;
        else
            return this._coreAudioAudioService = new CoreAudioAudioService(this.coreAudioAudioStorage);
    }
    private _coreAudioStateUseCaseStateUseCase?: CoreAudioStateUseCaseStateUseCase;
    public get coreAudioStateUseCaseStateUseCase(): CoreAudioStateUseCaseStateUseCase {
        if (this._coreAudioStateUseCaseStateUseCase)
            return this._coreAudioStateUseCaseStateUseCase;
        else
            return this._coreAudioStateUseCaseStateUseCase = new CoreAudioStateUseCaseStateUseCase(this.coreStartStartStorage, this.coreAudioAudioService, this.coreAudioAudioStorage);
    }
    private _coreGptStateUseCaseStateUseCase?: CoreGptStateUseCaseStateUseCase;
    public get coreGptStateUseCaseStateUseCase(): CoreGptStateUseCaseStateUseCase {
        if (this._coreGptStateUseCaseStateUseCase)
            return this._coreGptStateUseCaseStateUseCase;
        else
            return this._coreGptStateUseCaseStateUseCase = new CoreGptStateUseCaseStateUseCase(this.coreGptConversationStorage);
    }
    private _startControllerDataCollector?: StartControllerDataCollector;
    public get startControllerDataCollector(): StartControllerDataCollector {
        if (this._startControllerDataCollector)
            return this._startControllerDataCollector;
        else
            return this._startControllerDataCollector = new StartControllerDataCollector(this.coreGptStateUseCaseStateUseCase, this.coreStartStartUseCaseStartUseCase, this.coreAudioStateUseCaseStateUseCase);
    }
    private _startControllerStartControllerBus?: StartControllerStartControllerBus;
    public get startControllerStartControllerBus(): StartControllerStartControllerBus {
        if (this._startControllerStartControllerBus)
            return this._startControllerStartControllerBus;
        else
            return this._startControllerStartControllerBus = new StartControllerStartControllerBus();
    }
    private _startViewStartPresenter?: StartViewStartPresenter;
    public get startViewStartPresenter(): StartViewStartPresenter {
        if (this._startViewStartPresenter)
            return this._startViewStartPresenter;
        else
            return this._startViewStartPresenter = new StartViewStartPresenter();
    }
    private _coreStartStartUseCaseStartUseCase?: CoreStartStartUseCaseStartUseCase;
    public get coreStartStartUseCaseStartUseCase(): CoreStartStartUseCaseStartUseCase {
        if (this._coreStartStartUseCaseStartUseCase)
            return this._coreStartStartUseCaseStartUseCase;
        else
            return this._coreStartStartUseCaseStartUseCase = new CoreStartStartUseCaseStartUseCase(this.coreStartStartStorage);
    }
    private _startControllerController?: StartControllerController;
    public get startControllerController(): StartControllerController {
        if (this._startControllerController)
            return this._startControllerController;
        else
            return this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.manualInjections.startControllerControllerArray, this.startControllerStartControllerBus, this.startControllerDataCollector);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
