// @formatter:off
import CoreAudioAudioStorage from 'Core/Audio/AudioStorage';
import CoreAudioAddTextUseCaseAddAudioTextUseCase from 'Core/Audio/AddTextUseCase/AddAudioTextUseCase';
import AudioViewAudioPresenter from 'Application/Audio/View/AudioPresenter';
import CoreStartStartStorage from 'Core/Start/StartStorage';
import CoreAudioAudioService from 'Core/Audio/AudioService';
import CoreStartStartUseCaseStartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartViewStartPresenter from 'Application/Start/View/StartPresenter';
import WelcomeControllerController from 'Application/Welcome/Controller/Controller';
import StartAdapter from 'Application/Start/Adapter';
import StartControllerController from 'Application/Start/Controller/Controller';
import { Start } from 'Application/Start/View/Start';
import Welcome from 'Application/Welcome/View/Welcome';
import renderApplication from 'Application/Start/View/Start';
import ViewInjection from '@enbock/ts-jsx/ViewInjection';
import StartMemory from 'Infrastructure/Storage/Start/Memory';
import AudioMemory from 'Infrastructure/Storage/Audio/Memory';
interface ManualInjections {
    startControllerControllerView: typeof Start;
    welcomeControllerControllerView: typeof Welcome;
    startControllerControllerInitializeApplicationView: typeof renderApplication;
    startControllerControllerDocument: Document;
    audioViewAudioPresenterSoundServiceUrl: string;
    ViewInjection: typeof ViewInjection;
}
interface InterfaceInstances {
    coreStartStartStorage: StartMemory;
    coreAudioAudioStorage: AudioMemory;
}
interface AdditionalResources {
    welcomeController: WelcomeControllerController;
}
class Container {
    private manualInjections: ManualInjections = {
        welcomeControllerControllerView: Welcome,
        startControllerControllerView: Start,
        startControllerControllerDocument: document,
        startControllerControllerInitializeApplicationView: renderApplication,
        audioViewAudioPresenterSoundServiceUrl: "https://api.itbock.de/speech",
        ViewInjection: ViewInjection
    };
    private interfaceInstances: InterfaceInstances & AdditionalResources = {
        welcomeController: this.welcomeControllerController,
        coreStartStartStorage: new StartMemory(),
        coreAudioAudioStorage: new AudioMemory()
    };
    constructor() {
        ViewInjection(Start, this.startAdapter);
    }
    public get coreAudioAudioStorage(): CoreAudioAudioStorage {
        return this.interfaceInstances.coreAudioAudioStorage;
    }
    public get coreStartStartStorage(): CoreStartStartStorage {
        return this.interfaceInstances.coreStartStartStorage;
    }
    private _startAdapter?: StartAdapter;
    public get startAdapter(): StartAdapter {
        if (this._startAdapter)
            return this._startAdapter;
        else
            return this._startAdapter = new StartAdapter();
    }
    private _coreAudioAddTextUseCaseAddAudioTextUseCase?: CoreAudioAddTextUseCaseAddAudioTextUseCase;
    public get coreAudioAddTextUseCaseAddAudioTextUseCase(): CoreAudioAddTextUseCaseAddAudioTextUseCase {
        if (this._coreAudioAddTextUseCaseAddAudioTextUseCase)
            return this._coreAudioAddTextUseCaseAddAudioTextUseCase;
        else
            return this._coreAudioAddTextUseCaseAddAudioTextUseCase = new CoreAudioAddTextUseCaseAddAudioTextUseCase(this.coreAudioAudioStorage);
    }
    private _welcomeControllerController?: WelcomeControllerController;
    public get welcomeControllerController(): WelcomeControllerController {
        if (this._welcomeControllerController)
            return this._welcomeControllerController;
        else
            return this._welcomeControllerController = new WelcomeControllerController(this.manualInjections.welcomeControllerControllerView, this.coreAudioAddTextUseCaseAddAudioTextUseCase);
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
            return this._startControllerController = new StartControllerController(this.manualInjections.startControllerControllerDocument, this.manualInjections.startControllerControllerInitializeApplicationView, this.manualInjections.startControllerControllerView, this.coreStartStartUseCaseStartUseCase, this.startViewStartPresenter, this.welcomeControllerController, this.startAdapter);
    }
}
var DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
