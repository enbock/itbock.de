import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import StartController from 'Application/Start/Controller/Controller';
import renderApplication from 'Application/Start/View/Start';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartPresenter from 'Application/Start/View/StartPresenter';
import StartDataCollector from 'Application/Start/Controller/DataCollector';
import AudioTransformClient from 'Core/Audio/AudioTransformClient';
import NetworkAudioTransformClient from 'Infrastructure/AudioTransformClient/Network';
import Config from 'Application/DependencyInjection/Config';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioService from 'Core/Audio/AudioService';
import AudioStorage from 'Core/Audio/AudioStorage';
import MemoryAudioStorage from 'Infrastructure/Storage/Audio/Memory';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import StartStorage from 'Core/Start/StartStorage';
import MemoryStartStorage from 'Infrastructure/Storage/Start/Memory';
import AudioTransformUseCase from 'Core/Audio/AudioTransformCase/AudioTransformUseCase';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import GptClient from 'Core/Gpt/GptClient';
import NetworkGptClient from 'Infrastructure/GptClient/Network/Network';
import GptClientNetworkEncoder from 'Infrastructure/GptClient/Network/Encoder';
import AudioInputHandler from 'Application/Start/Controller/Handler/AudioInputHandler';
import AudioOutputHandler from 'Application/Start/Controller/Handler/AudioOutputHandler';
import AudioInputHandlerConversationInputHandler from 'Application/Start/Controller/Handler/ConversationInputHandler';
import StartHandler from 'Application/Start/Controller/Handler/StartHandler';
import StartAdapter from 'Application/Start/Adapter';
import StartScreenPresenter from 'Application/Start/View/StartScreen/StartScreenPresenter';
import OldPagePresenter from 'Application/Start/View/OldPage/OldPagePresenter';
import ConversationPresenter from 'Application/Start/View/Conversation/ConversationPresenter';
import AudioPresenter from 'Application/Start/View/Audio/AudioPresenter';
import InfoPresenter from 'Application/Start/View/Info/InfoPresenter';
import Fake from 'Infrastructure/GptClient/Fake/Fake';
import StartCase from 'Infrastructure/GptClient/Fake/Cases/StartCase';
import Suspend from 'Infrastructure/GptClient/Fake/Cases/Suspend';
import ShutdownTerminal from 'Infrastructure/GptClient/Fake/Cases/ShutdownTerminal';
import OldHomepage from 'Infrastructure/GptClient/Fake/Cases/OldHomepage';
import LanguageCacheMemory from 'Infrastructure/I18n/Cache/Memory';
import LanguageTranslationClientRest from 'Infrastructure/I18n/Rest/LanguageTranslationClient';
import LanguageUseCase from 'Core/I18n/UseCase/LanguageUseCase';
import AudioFeedbackUseCase from 'Core/Audio/FeedbackUseCase/FeedbackUseCase';
import AudioFeedbackClientBrowser from 'Infrastructure/Audio/Feedback/Client/Browser/Browser';
import {AudioFeedback} from 'Core/Audio/AudioFeedbackClient';
import StartReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';
import StartReplicationCacheMemory from 'Infrastructure/Start/Replication/Cache/Memory/Memory';
import StartReplicationClientNetwork from 'Infrastructure/Start/Replication/Client/Network/Network';
import StartReplicationClientNetworkParser from 'Infrastructure/Start/Replication/Client/Network/Parser';
import StartReplicationClientNetworkEncoder from 'Infrastructure/Start/Replication/Client/Network/Encoder';
import ReplicationSessionService from 'Core/Replication/SessionService';
import ReplicationSessionStorageLocalStorage from 'Infrastructure/Replication/SessionStorage/LocalStorage/LocalStorage';
import StartControllerReplicationPollHandler from 'Application/Start/Controller/Handler/ReplicationPollHandler';
import ReplicationPollHandler from 'Application/Start/Controller/Handler/ReplicationPollHandler';
import TimeHelper from 'Application/Start/TimeHelper/TimeHelper';
import AudioOutputDevice from 'Application/Start/View/Audio/AudioOutputDevice';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import StartBus from 'Application/Start/StartBus';
import LeaderUseCase from 'Core/Replication/LeaderUseCase/LeaderUseCase';
import WebLocks from 'Infrastructure/Replication/LeaderElection/WebLocks';
import LeaderHandler from 'Application/Start/Controller/Handler/LeaderHandler';

class Container {
    private config: Config = new Config();
    private fetchHelper: FetchHelper = new FetchHelper();
    private parseHelper: ParseHelper = new ParseHelper();
    private timeHelper: TimeHelper = new TimeHelper();

    private startAdapter: StartAdapter = new StartAdapter();
    private startBus: StartBus = new StartBus();
    private lockManager: LockManager | undefined = this.createLockManager();
    private sessionBrowserStorage: Storage = this.createSessionBrowserStorage();
    private replicationSessionService: ReplicationSessionService = new ReplicationSessionService(
        () => crypto.randomUUID(),
        new ReplicationSessionStorageLocalStorage(this.sessionBrowserStorage)
    );
    private leaderUseCase: LeaderUseCase = new LeaderUseCase(
        new WebLocks(this.lockManager)
    );

    private audioTransformClient: AudioTransformClient = new NetworkAudioTransformClient(
        this.fetchHelper,
        this.config.transformUrl
    );
    private encoder: GptClientNetworkEncoder = new GptClientNetworkEncoder();
    private gptClient: GptClient = this.config.useFakeApi
        ? new Fake(
            [
                new StartCase(),
                new Suspend(),
                new ShutdownTerminal(),
                new OldHomepage()
            ]
        )
        : new NetworkGptClient(
            this.fetchHelper,
            this.parseHelper,
            this.config.gptClientUrl,
            this.encoder,
            this.replicationSessionService
        )
    ;
    private audioStorage: AudioStorage = new MemoryAudioStorage();
    private startStorage: StartStorage = new MemoryStartStorage();
    private audioService: AudioService = new AudioService(
        this.audioStorage
    );
    private audioTransformUseCase: AudioTransformUseCase = new AudioTransformUseCase(
        this.audioTransformClient
    );
    private inputUseCase: InputUseCase = new InputUseCase(
        this.audioStorage
    );
    private audioStateUseCase: AudioStateUseCase = new AudioStateUseCase(
        this.audioService,
        this.audioStorage
    );
    private audioFeedbackClientBrowser: AudioFeedbackClientBrowser = new AudioFeedbackClientBrowser(
        {
            [AudioFeedback.COMPUTER_BEEP]: [
                'sounds/voiceinput1.wav',
                'sounds/voiceinput2.wav'
            ],
            [AudioFeedback.SCREEN_ON]: [
                'sounds/scrshow.wav'
            ],
            [AudioFeedback.SCREEN_OFF]: [
                'sounds/scrhide.wav'
            ]
        },
        document.body
    );
    private startReplicationUseCase: StartReplicationUseCase = new StartReplicationUseCase(
        new StartReplicationCacheMemory(),
        new StartReplicationClientNetwork(
            this.fetchHelper,
            new StartReplicationClientNetworkEncoder(
                this.config.replicationUrlStart
            ),
            new StartReplicationClientNetworkParser(
                this.parseHelper
            )
        ),
        this.replicationSessionService
    );
    private startUseCase: StartUseCase = new StartUseCase(
        this.startStorage,
        this.audioFeedbackClientBrowser
    );
    private conversationUseCase: ConversationUseCase = new ConversationUseCase(
        this.gptClient,
        this.audioService,
        this.startStorage,
        this.startReplicationUseCase,
        this.inputUseCase,
        this.startUseCase
    );
    private audioOutputDevice: AudioOutputDevice = new AudioOutputDevice(
        this.startAdapter
    );
    private startPresenter: StartPresenter = new StartPresenter(
        new StartScreenPresenter(),
        new OldPagePresenter(),
        new ConversationPresenter(),
        new InfoPresenter(),
        new AudioPresenter(
            this.audioOutputDevice
        )
    );
    private languageCache: LanguageCacheMemory = new LanguageCacheMemory();
    private languageTranslationClient: LanguageTranslationClientRest = new LanguageTranslationClientRest(
        this.config.translationServiceUrl,
        this.fetchHelper
    );
    private startDataCollector: StartDataCollector = new StartDataCollector(
        this.audioStateUseCase,
        this.conversationUseCase,
        this.startUseCase,
        new LanguageUseCase(
            this.languageTranslationClient,
            this.languageCache
        ),
        this.startReplicationUseCase,
        this.leaderUseCase
    );
    private audioFeedbackUseCase: AudioFeedbackUseCase = new AudioFeedbackUseCase(
        this.audioFeedbackClientBrowser
    );
    private audioInputHandlerConversationInputHandler:
        AudioInputHandlerConversationInputHandler = new AudioInputHandlerConversationInputHandler(
        this.conversationUseCase,
        this.startBus
    );
    private audioInputHandler: AudioInputHandler = new AudioInputHandler(
        this.startAdapter,
        this.inputUseCase,
        this.audioTransformUseCase,
        this.audioFeedbackUseCase,
        this.startBus
    );
    private playbackUseCase: PlaybackUseCase = new PlaybackUseCase(
        this.audioStorage
    );
    private audioOutputHandler: AudioOutputHandler = new AudioOutputHandler(
        this.startAdapter,
        this.playbackUseCase,
        this.inputUseCase,
        this.leaderUseCase
    );
    private leaderHandler: LeaderHandler = new LeaderHandler(
        this.leaderUseCase,
        this.inputUseCase,
        this.startReplicationUseCase
    );
    private startControllerReplicationPollHandler: ReplicationPollHandler = new StartControllerReplicationPollHandler(
        this.timeHelper,
        this.startReplicationUseCase,
        this.config.replicationPollTime
    );
    private startHandler: StartHandler = new StartHandler(
        this.startUseCase,
        this.inputUseCase,
        this.conversationUseCase,
        this.startAdapter,
        this.leaderUseCase,
        this.startControllerReplicationPollHandler
    );
    public startController: StartController = new StartController(
        document,
        renderApplication,
        this.startAdapter,
        this.startUseCase,
        this.startPresenter,
        [],
        [
            this.leaderHandler,
            this.audioInputHandler,
            this.audioOutputHandler,
            this.startHandler,
            this.audioInputHandlerConversationInputHandler,
            this.startControllerReplicationPollHandler
        ],
        this.startDataCollector,
        navigator.language,
        this.inputUseCase
    );

    private createLockManager(): LockManager | undefined {
        try {
            return navigator.locks;
        } catch {
            return undefined;
        }
    }

    private createSessionBrowserStorage(): Storage {
        try {
            return window.localStorage;
        } catch {
            return this.createMemoryStorage();
        }
    }

    private createMemoryStorage(): Storage {
        const data: Map<string, string> = new Map<string, string>();

        return {
            get length(): number {
                return data.size;
            },
            clear(): void {
                data.clear();
            },
            getItem(key: string): string | null {
                return data.get(key) || null;
            },
            key(index: number): string | null {
                const keys: Array<string> = Array.from(data.keys());
                return keys[index] || null;
            },
            removeItem(key: string): void {
                data.delete(key);
            },
            setItem(key: string, value: string): void {
                data.set(key, value);
            }
        };
    }
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
