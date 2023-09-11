// @formatter:off
// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols

import CoreGptGptClient from 'Core/Gpt/GptClient';
import CoreAudioAudioService from 'Core/Audio/AudioService';
import CoreGptGeneralConversationUseCaseGeneralConversationUseCase from 'Core/Gpt/GeneralConversationUseCase/GeneralConversationUseCase';
import StartControllerStartControllerBus from 'Application/Start/Controller/StartControllerBus';
import AudioViewAudioPresenter from 'Application/Audio/View/AudioPresenter';
import CoreAudioAudioStorage from 'Core/Audio/AudioStorage';
import CoreStartStartStorage from 'Core/Start/StartStorage';
import CoreStartStartUseCaseStartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartViewStartPresenter from 'Application/Start/View/StartPresenter';
import StartAdapter from 'Application/Start/Adapter';
import StartControllerController from 'Application/Start/Controller/Controller';
import WelcomeControllerController from 'Application/Welcome/Controller/Controller';
import ModuleController from 'Application/ModuleController';
import { Start } from 'Application/Start/View/Start';
import Welcome from 'Application/Welcome/View/Welcome';
import renderApplication from 'Application/Start/View/Start';
import ViewInjection from '@enbock/ts-jsx/ViewInjection';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import StartMemory from 'Infrastructure/Storage/Start/Memory';
import AudioMemory from 'Infrastructure/Storage/Audio/Memory';
import CoreGptGptClientNetwork from 'Infrastructure/GptClient/Network';
interface ManualInjections {
    startControllerControllerArray: Array<ModuleController>;
    startControllerControllerView: typeof Start;
    welcomeControllerControllerView: typeof Welcome;
    startControllerControllerInitializeApplicationView: typeof renderApplication;
    startControllerControllerDocument: Document;
    audioViewAudioPresenterSoundServiceUrl: string;
    generalGptServiceUrl: string;
    ViewInjection: typeof ViewInjection;
    fetchHelper: FetchHelper;
    parseHelper: ParseHelper;
}
interface InterfaceInstances {
    coreStartStartStorage: StartMemory;
    coreAudioAudioStorage: AudioMemory;
    coreGptGptClient: CoreGptGptClientNetwork;
}
interface AdditionalResources {
    welcomeControllerController: WelcomeControllerController;
}
class Container {
    private manualInjections: ManualInjections = {
        welcomeControllerControllerView: Welcome,
        startControllerControllerView: Start,
        startControllerControllerDocument: document,
        startControllerControllerInitializeApplicationView: renderApplication,
        audioViewAudioPresenterSoundServiceUrl: "https://api.itbock.de/speech",
        generalGptServiceUrl: "https://api.itbock.de/gpt/general",
        ViewInjection: ViewInjection,
        fetchHelper: new FetchHelper(),
        parseHelper: new ParseHelper(),
        startControllerControllerArray: []
    };
    private interfaceInstances: InterfaceInstances = {
        coreStartStartStorage: new StartMemory(),
        coreAudioAudioStorage: new AudioMemory(),
        coreGptGptClient: "" as any
    };
    constructor() {
        ViewInjection(Start, this.startAdapter);
        this.interfaceInstances.coreGptGptClient = new CoreGptGptClientNetwork(this.manualInjections.fetchHelper, this.manualInjections.parseHelper, this.manualInjections.generalGptServiceUrl);
        this.manualInjections.startControllerControllerArray = [
            this.welcomeControllerController
        ];
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
    private _coreGptGeneralConversationUseCaseGeneralConversationUseCase?: CoreGptGeneralConversationUseCaseGeneralConversationUseCase;
    public get coreGptGeneralConversationUseCaseGeneralConversationUseCase(): CoreGptGeneralConversationUseCaseGeneralConversationUseCase {
        if (this._coreGptGeneralConversationUseCaseGeneralConversationUseCase)
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase;
        else
            return this._coreGptGeneralConversationUseCaseGeneralConversationUseCase = new CoreGptGeneralConversationUseCaseGeneralConversationUseCase(this.coreGptGptClient, this.coreAudioAudioService);
    }
    private _welcomeControllerController?: WelcomeControllerController;
    public get welcomeControllerController(): WelcomeControllerController {
        if (this._welcomeControllerController)
            return this._welcomeControllerController;
        else
            return this._welcomeControllerController = new WelcomeControllerController(this.manualInjections.welcomeControllerControllerView, this.coreGptGeneralConversationUseCaseGeneralConversationUseCase, this.startControllerStartControllerBus);
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
            return this._startViewStartPresenter = new StartViewStartPresenter(this.audioViewAudioPresenter);
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
            return this._coreStartStartUseCaseStartUseCase = new CoreStartStartUseCaseStartUseCase(this.coreStartStartStorage, this.coreAudioAudioService);
    }
    private _startControllerController?: StartControllerController;
    public get startControllerController(): StartControllerController {
        if (this._startControllerController)
            return this._startControllerController;
        else
            return this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.manualInjections.startControllerControllerArray, this.startAdapter, this.startControllerStartControllerBus);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
