// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import WelcomeAdapter from 'Application/Welcome/Adapter';
import CoreGptGeneralConversationUseCaseGeneralConversationUseCase
    from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import AudioControllerAudioControllerBus from 'Application/Audio/Controller/AudioControllerBus';
import StartControllerStartControllerBus from 'Application/Start/Controller/StartControllerBus';
import CoreAudioInputUseCaseInputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import CoreGptConversationResetUseCaseConversationResetUseCase
    from 'Core/Gpt/ConversationResetUseCase/ConversationResetUseCase';
import CoreWelcomeOldHomepageUseCaseOldHomepageUseCase from 'Core/Welcome/OldHomepageUseCase/OldHomepageUseCase';
import AudioViewInputInputPresenter from 'Application/Audio/View/Input/InputPresenter';
import AudioViewAudioPresenter from 'Application/Audio/View/AudioPresenter';
import CoreAudioStateUseCaseStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import CoreStartStartUseCaseStartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import AudioAdapter from 'Application/Audio/Adapter';
import CoreAudioPlaybackUseCasePlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import CoreAudioAudioService from 'Core/Audio/AudioService';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import InfrastructureGptClientNetworkEncoder from 'Infrastructure/GptClient/Network/Encoder';
import CoreGptStateUseCaseStateUseCase from 'Core/Gpt/StateUseCase/StateUseCase';
import CoreWelcomeStateUseCaseStateUseCase from 'Core/Welcome/StateUseCase/StateUseCase';
import WelcomeViewWelcomePresenter from 'Application/Welcome/View/WelcomePresenter';
import WelcomeControllerDataCollector from 'Application/Welcome/Controller/DataCollector';
import StartViewStartPresenter from 'Application/Start/View/StartPresenter';
import StartControllerDataCollector from 'Application/Start/Controller/DataCollector';
import StartControllerController from 'Application/Start/Controller/Controller';
import WelcomeControllerController from 'Application/Welcome/Controller/Controller';
import InfrastructureGptClientNetworkNetwork from 'Infrastructure/GptClient/Network/Network';
import WelcomeControllerHandlerConversationInputHandler
    from 'Application/Welcome/Controller/Handler/ConversationInputHandler';
import AudioControllerHandlerAudioInputHandler from 'Application/Audio/Controller/Handler/AudioInputHandler';
import AudioViewInputInput from 'Application/Audio/View/Input/Input';
import AudioControllerHandlerAudioOutputHandler from 'Application/Audio/Controller/Handler/AudioOutputHandler';
import InfrastructureStorageWelcomeMemory from 'Infrastructure/Storage/Welcome/Memory';
import StartControllerHandlerStartHandler from 'Application/Start/Controller/Handler/StartHandler';
import InfrastructureGptClientFakeFake from 'Infrastructure/GptClient/Fake/Fake';
import InfrastructureGptClientFakeCasesStartCase from 'Infrastructure/GptClient/Fake/Cases/StartCase';
import InfrastructureGptClientFakeCasesMuteMicrophone from 'Infrastructure/GptClient/Fake/Cases/MuteMicrophone';
import InfrastructureGptClientFakeCasesOldHomepage from 'Infrastructure/GptClient/Fake/Cases/OldHomepage';
import AudioControllerController from 'Application/Audio/Controller/Controller';
import WelcomeControllerHandlerCommandMuteHandler from 'Application/Welcome/Controller/Handler/Command/MuteHandler';
import WelcomeControllerHandlerCommandOldHomepageHandler
    from 'Application/Welcome/Controller/Handler/Command/OldHomepageHandler';
import AudioControllerHandlerCommandSuspendCommand from 'Application/Audio/Controller/Handler/Command/SuspendCommand';
import InfrastructureGptClientFakeCasesEndOfTopicCase from 'Infrastructure/GptClient/Fake/Cases/EndOfTopicCase';
import WelcomeControllerHandlerCommandSuspendCommand
    from 'Application/Welcome/Controller/Handler/Command/SuspendCommand';
import AudioControllerHandlerStandbyReceiver from 'Application/Audio/Controller/Handler/StandbyReceiver';
import WelcomeControllerHandlerStartHandler from 'Application/Welcome/Controller/Handler/StartHandler';
import Audio from 'Application/Audio/View/Audio';
import FakeCase from 'Infrastructure/GptClient/Fake/Cases/FakeCase';
import renderApplication, {Start} from 'Application/Start/View/Start';
import Welcome from 'Application/Welcome/View/Welcome';
import ViewInjection from '@enbock/ts-jsx/ViewInjection';
import ConversationMemory from 'Infrastructure/Conversation/Memory';
import StartMemory from 'Infrastructure/Storage/Start/Memory';
import AudioMemory from 'Infrastructure/Storage/Audio/Memory';
import env from '../config/env.json';
import GptClient from 'Core/Gpt/GptClient';
import ModuleController from 'Application/ModuleController';

function getEnv(key: string): string {
    return (env as any)[key] || '';
}

class Container {
    private startControllerControllerView = Start;
    private audioControllerControllerViewComponent = Audio;
    private welcomeControllerControllerViewTemplate = Welcome;
    private startControllerControllerDocument = document;
    private startControllerControllerInitializeApplicationView = renderApplication;
    private ViewInjection = ViewInjection;
    private fetchHelper: FetchHelper = new FetchHelper();
    private parseHelper: ParseHelper = new ParseHelper();
    private infrastructureGptClientNetworkNetworkServiceUrl: string = 'https://api.itbock.de/gpt/general';
    private audioViewInputInputRecognitionClass = (window as any)['SpeechRecognition'] || (window as any)['webkitSpeechRecognition'] || (window as any)['speechRecognition'];
    private coreAudioInputUseCaseInputUseCaseArray = [
        'computer',
        'terminal'
    ];
    private infrastructureStorageWelcomeMemory: InfrastructureStorageWelcomeMemory = new InfrastructureStorageWelcomeMemory();
    private coreStartStartStorage = new StartMemory();
    private coreAudioAudioStorage = new AudioMemory();
    private coreGptConversationStorage = new ConversationMemory();
    private coreWelcomeStateStorage = this.infrastructureStorageWelcomeMemory;
    private welcomeAdapter: WelcomeAdapter = new WelcomeAdapter();
    private infrastructureGptClientFakeCasesEndOfTopicCase: InfrastructureGptClientFakeCasesEndOfTopicCase = new InfrastructureGptClientFakeCasesEndOfTopicCase();
    private coreGptConversationResetUseCaseConversationResetUseCase: CoreGptConversationResetUseCaseConversationResetUseCase = new CoreGptConversationResetUseCaseConversationResetUseCase(this.coreGptConversationStorage);
    private welcomeControllerHandlerCommandSuspendCommand: WelcomeControllerHandlerCommandSuspendCommand = new WelcomeControllerHandlerCommandSuspendCommand(this.coreGptConversationResetUseCaseConversationResetUseCase);
    private audioViewInputInputPresenter: AudioViewInputInputPresenter = new AudioViewInputInputPresenter();
    private audioViewAudioPresenter: AudioViewAudioPresenter = new AudioViewAudioPresenter(this.audioViewInputInputPresenter);
    private infrastructureGptClientFakeCasesOldHomepage: InfrastructureGptClientFakeCasesOldHomepage = new InfrastructureGptClientFakeCasesOldHomepage();
    private infrastructureGptClientFakeCasesMuteMicrophone: InfrastructureGptClientFakeCasesMuteMicrophone = new InfrastructureGptClientFakeCasesMuteMicrophone();
    private infrastructureGptClientFakeCasesStartCase: InfrastructureGptClientFakeCasesStartCase = new InfrastructureGptClientFakeCasesStartCase();
    private infrastructureGptClientFakeFakeArray: Array<FakeCase> = [
        this.infrastructureGptClientFakeCasesStartCase,
        this.infrastructureGptClientFakeCasesMuteMicrophone,
        this.infrastructureGptClientFakeCasesOldHomepage,
        this.infrastructureGptClientFakeCasesEndOfTopicCase
    ];
    private infrastructureGptClientFakeFake: InfrastructureGptClientFakeFake = new InfrastructureGptClientFakeFake(this.infrastructureGptClientFakeFakeArray);
    private coreAudioPlaybackUseCasePlaybackUseCase: CoreAudioPlaybackUseCasePlaybackUseCase = new CoreAudioPlaybackUseCasePlaybackUseCase(this.coreAudioAudioStorage);
    private coreAudioInputUseCaseInputUseCase: CoreAudioInputUseCaseInputUseCase = new CoreAudioInputUseCaseInputUseCase(this.coreAudioAudioStorage, this.coreAudioInputUseCaseInputUseCaseArray);
    private audioControllerHandlerStandbyReceiver: AudioControllerHandlerStandbyReceiver = new AudioControllerHandlerStandbyReceiver(this.coreAudioInputUseCaseInputUseCase);
    private audioControllerHandlerCommandSuspendCommand: AudioControllerHandlerCommandSuspendCommand = new AudioControllerHandlerCommandSuspendCommand(this.coreAudioInputUseCaseInputUseCase);
    private audioAdapter: AudioAdapter = new AudioAdapter();
    private audioViewInputInput: AudioViewInputInput = new AudioViewInputInput(this.audioViewInputInputRecognitionClass, this.audioAdapter);
    private audioControllerAudioControllerBus: AudioControllerAudioControllerBus = new AudioControllerAudioControllerBus();
    private welcomeControllerHandlerCommandMuteHandler: WelcomeControllerHandlerCommandMuteHandler = new WelcomeControllerHandlerCommandMuteHandler(this.coreAudioInputUseCaseInputUseCase, this.audioControllerAudioControllerBus, this.coreGptConversationResetUseCaseConversationResetUseCase);
    private infrastructureGptClientNetworkEncoder: InfrastructureGptClientNetworkEncoder = new InfrastructureGptClientNetworkEncoder();
    private infrastructureGptClientNetworkNetwork: InfrastructureGptClientNetworkNetwork = new InfrastructureGptClientNetworkNetwork(this.fetchHelper, this.parseHelper, this.infrastructureGptClientNetworkNetworkServiceUrl, this.infrastructureGptClientNetworkEncoder);
    private coreWelcomeStateUseCaseStateUseCase: CoreWelcomeStateUseCaseStateUseCase = new CoreWelcomeStateUseCaseStateUseCase(this.coreWelcomeStateStorage);
    private welcomeViewWelcomePresenter: WelcomeViewWelcomePresenter = new WelcomeViewWelcomePresenter();
    private coreWelcomeOldHomepageUseCaseOldHomepageUseCase: CoreWelcomeOldHomepageUseCaseOldHomepageUseCase = new CoreWelcomeOldHomepageUseCaseOldHomepageUseCase(this.coreWelcomeStateStorage);
    private welcomeControllerHandlerCommandOldHomepageHandler: WelcomeControllerHandlerCommandOldHomepageHandler = new WelcomeControllerHandlerCommandOldHomepageHandler(this.coreWelcomeOldHomepageUseCaseOldHomepageUseCase);
    private welcomeControllerHandlerConversationInputHandlerArray = [
        this.welcomeControllerHandlerCommandOldHomepageHandler,
        this.welcomeControllerHandlerCommandMuteHandler,
        this.audioControllerHandlerCommandSuspendCommand,
        this.welcomeControllerHandlerCommandSuspendCommand
    ];
    private coreAudioAudioService: CoreAudioAudioService = new CoreAudioAudioService(this.coreAudioAudioStorage);
    private coreGptGptClient: GptClient = getEnv('FAKE') ? this.infrastructureGptClientFakeFake : this.infrastructureGptClientNetworkNetwork;
    public coreGptGeneralConversationUseCaseGeneralConversationUseCase: CoreGptGeneralConversationUseCaseGeneralConversationUseCase = new CoreGptGeneralConversationUseCaseGeneralConversationUseCase(
        this.coreGptGptClient,
        this.coreAudioAudioService,
        this.coreGptConversationStorage,
        this.coreStartStartStorage
    );
    private coreAudioStateUseCaseStateUseCase: CoreAudioStateUseCaseStateUseCase = new CoreAudioStateUseCaseStateUseCase(this.coreStartStartStorage, this.coreAudioAudioService, this.coreAudioAudioStorage);
    private coreGptStateUseCaseStateUseCase: CoreGptStateUseCaseStateUseCase = new CoreGptStateUseCaseStateUseCase(this.coreGptConversationStorage);
    private startControllerDataCollector: StartControllerDataCollector = new StartControllerDataCollector(this.coreGptStateUseCaseStateUseCase, this.coreAudioStateUseCaseStateUseCase);
    private startControllerStartControllerBus: StartControllerStartControllerBus = new StartControllerStartControllerBus();
    private welcomeControllerHandlerStartHandler: WelcomeControllerHandlerStartHandler = new WelcomeControllerHandlerStartHandler(this.welcomeAdapter, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.audioControllerAudioControllerBus, this.startControllerStartControllerBus);
    private audioControllerHandlerAudioOutputHandler: AudioControllerHandlerAudioOutputHandler = new AudioControllerHandlerAudioOutputHandler(this.audioAdapter, this.coreAudioPlaybackUseCasePlaybackUseCase, this.startControllerStartControllerBus);
    private welcomeControllerHandlerConversationInputHandler: WelcomeControllerHandlerConversationInputHandler = new WelcomeControllerHandlerConversationInputHandler(this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.welcomeControllerHandlerConversationInputHandlerArray, this.audioControllerAudioControllerBus, this.startControllerStartControllerBus);
    private welcomeControllerControllerArray = [
        this.welcomeControllerHandlerConversationInputHandler,
        this.welcomeControllerHandlerStartHandler
    ];
    private audioControllerHandlerAudioInputHandlerArray = [
        this.audioControllerHandlerStandbyReceiver,
        this.welcomeControllerHandlerConversationInputHandler
    ];
    private audioControllerHandlerAudioInputHandler: AudioControllerHandlerAudioInputHandler = new AudioControllerHandlerAudioInputHandler(this.audioAdapter, this.coreAudioInputUseCaseInputUseCase, this.audioControllerHandlerAudioInputHandlerArray);
    private audioControllerControllerHandler = [
        this.audioControllerHandlerAudioInputHandler,
        this.audioControllerHandlerAudioOutputHandler
    ];
    private startViewStartPresenter: StartViewStartPresenter = new StartViewStartPresenter();
    private coreStartStartUseCaseStartUseCase: CoreStartStartUseCaseStartUseCase = new CoreStartStartUseCaseStartUseCase(this.coreStartStartStorage);
    private startControllerHandlerStartHandler: StartControllerHandlerStartHandler = new StartControllerHandlerStartHandler(this.startControllerStartControllerBus, this.coreStartStartUseCaseStartUseCase, this.audioControllerAudioControllerBus);
    private startControllerControllerArrayHandler = [
        this.startControllerHandlerStartHandler
    ];
    private welcomeControllerDataCollector: WelcomeControllerDataCollector = new WelcomeControllerDataCollector(
        this.coreGptStateUseCaseStateUseCase,
        this.coreStartStartUseCaseStartUseCase,
        this.coreAudioStateUseCaseStateUseCase,
        this.coreWelcomeStateUseCaseStateUseCase
    );
    private welcomeControllerController: WelcomeControllerController = new WelcomeControllerController(
        this.welcomeControllerControllerViewTemplate,
        this.welcomeControllerControllerArray,
        this.coreWelcomeOldHomepageUseCaseOldHomepageUseCase,
        this.welcomeViewWelcomePresenter,
        this.welcomeControllerDataCollector
    );
    public audioControllerController: AudioControllerController = new AudioControllerController(
        this.audioControllerControllerViewComponent,
        this.audioViewAudioPresenter,
        this.audioControllerControllerHandler,
        this.coreAudioStateUseCaseStateUseCase,
        this.audioControllerAudioControllerBus
    );

    private startControllerControllerArray: Array<ModuleController> = [
        this.audioControllerController,
        this.welcomeControllerController
    ];
    public startControllerController: StartControllerController = new StartControllerController(
        this.startControllerControllerDocument,
        this.startControllerControllerInitializeApplicationView,
        this.startControllerControllerView,
        this.coreStartStartUseCaseStartUseCase,
        this.startViewStartPresenter,
        this.startControllerControllerArray,
        this.startControllerControllerArrayHandler,
        this.startControllerStartControllerBus,
        this.startControllerDataCollector,
        navigator.language
    );

    constructor() {
        ViewInjection(Start);
        ViewInjection(Audio, this.audioAdapter, this.audioViewInputInput);
        ViewInjection(Welcome, this.welcomeAdapter);
    }
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
