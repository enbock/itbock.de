import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import StartController from 'Application/Start/Controller/Controller';
import renderApplication, {Start} from 'Application/Start/View/Start';
import ViewInjection from '@enbock/ts-jsx/ViewInjection';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartPresenter from 'Application/Start/View/StartPresenter';
import StartDataCollector from 'Application/Start/Controller/DataCollector';
import AudioTransformClient from 'Core/Audio/InputUseCase/AudioTransformClient';
import NetworkAudioTransformClient from 'Infrastructure/AudioTransformClient/Network';
import Config from 'Application/DependencyInjection/Config';
import InputUseCase from 'Core/Audio/InputUseCase/InputUseCase';
import AudioService from 'Core/Audio/AudioService';
import AudioStorage from 'Core/Audio/AudioStorage';
import MemoryAudioStorage from 'Infrastructure/Storage/Audio/Memory';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import ConversationStorage from 'Core/Gpt/ConversationStorage';
import MemoryConversationStorage from 'Infrastructure/Conversation/Memory';
import StartStorage from 'Core/Start/StartStorage';
import MemoryStartStorage from 'Infrastructure/Storage/Start/Memory';
import AudioTransformUseCase from 'Core/Audio/InputUseCase/AudioTransformUseCase';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import GptClient from 'Core/Gpt/GptClient';
import NetworkGptClient from 'Infrastructure/GptClient/Network/Network';
import GptClientNetworkEncoder from 'Infrastructure/GptClient/Network/Encoder';
import AudioAbortHandler from 'Application/Start/Controller/Handler/AudioAbortHandler';
import AudioInputHandler from 'Application/Start/Controller/Handler/AudioInputHandler';
import AudioOutputHandler from 'Application/Start/Controller/Handler/AudioOutputHandler';
import AudioInputHandlerConversationInputHandler from 'Application/Start/Controller/Handler/ConversationInputHandler';
import AudioInputHandlerStandbyReceiver from 'Application/Start/Controller/Handler/StandbyReceiver';
import StartHandler from 'Application/Start/Controller/Handler/StartHandler';
import StartAdapter from 'Application/Start/Adapter';
import StartScreenPresenter from 'Application/Start/View/StartScreen/StartScreenPresenter';
import OldPagePresenter from 'Application/Start/View/OldPage/OldPagePresenter';
import ConversationPresenter from 'Application/Start/View/Conversation/ConversationPresenter';
import AudioPresenter from 'Application/Start/View/Audio/AudioPresenter';
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
import {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';
import StartReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';
import StartReplicationCacheMemory from 'Infrastructure/Start/Replication/Cache/Memory/Memory';
import StartReplicationClientNetwork from 'Infrastructure/Start/Replication/Client/Network/Network';
import StartReplicationClientNetworkParser from 'Infrastructure/Start/Replication/Client/Network/Parser';
import StartReplicationClientNetworkEncoder from 'Infrastructure/Start/Replication/Client/Network/Encoder';
import ReplicationSessionService from 'Core/Replication/SessionService';
import {v4} from 'uuid';
import ReplicationSessionStorageMemory from 'Infrastructure/Replication/SessionStorage/Memory/Memory';
import StartControllerReplicationPollHandler from 'Application/Start/Controller/Handler/ReplicationPollHandler';
import ReplicationPollHandler from 'Application/Start/Controller/Handler/ReplicationPollHandler';
import TimeHelper from 'Application/Start/TimeHelper/TimeHelper';
import AudioOutputDevice from 'Application/Start/View/Audio/AudioOutputDevice';
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';

class Container {
    private config: Config = new Config();
    private fetchHelper: FetchHelper = new FetchHelper();
    private parseHelper: ParseHelper = new ParseHelper();
    private timeHelper: TimeHelper = new TimeHelper();
    
    private startAdapter: StartAdapter = new StartAdapter();

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
            this.encoder
        )
    ;
    private audioStorage: AudioStorage = new MemoryAudioStorage();
    private conversationStorage: ConversationStorage = new MemoryConversationStorage();
    private startStorage: StartStorage = new MemoryStartStorage();
    private audioService: AudioService = new AudioService(
        this.audioStorage
    );
    private audioTransformUseCase: AudioTransformUseCase = new AudioTransformUseCase(
        this.audioTransformClient
    );
    private inputUseCase: InputUseCase = new InputUseCase(
        this.audioStorage,
        this.config.wakeupWords
    );
    private audioStateUseCase: AudioStateUseCase = new AudioStateUseCase(
        this.audioService,
        this.audioStorage
    );
    private audioFeedbackClientBrowser: AudioFeedbackClientBrowser = new AudioFeedbackClientBrowser(
        {
            [FEEDBACK.COMPUTER_BEEP]: [
                'sounds/voiceinput1.wav',
                'sounds/voiceinput2.wav'
            ],
            [FEEDBACK.SCREEN_ON]: [
                'sounds/scrshow.wav'
            ],
            [FEEDBACK.SCREEN_OFF]: [
                'sounds/scrhide.wav'
            ]
        },
        document.body
    );
    private conversationUseCase: ConversationUseCase = new ConversationUseCase(
        this.conversationStorage,
        this.gptClient,
        this.audioService,
        this.startStorage,
        this.audioFeedbackClientBrowser
    );
    private startUseCase: StartUseCase = new StartUseCase(
        this.startStorage,
        this.audioFeedbackClientBrowser
    );
    private audioOutputDevice: AudioOutputDevice = new AudioOutputDevice(
        this.startAdapter
    );
    private startPresenter: StartPresenter = new StartPresenter(
        new StartScreenPresenter(),
        new OldPagePresenter(),
        new ConversationPresenter(),
        new AudioPresenter(
            this.audioOutputDevice
        )
    );
    private languageCache: LanguageCacheMemory = new LanguageCacheMemory();
    private languageTranslationClient: LanguageTranslationClientRest = new LanguageTranslationClientRest(
        this.config.translationServiceUrl,
        this.fetchHelper
    );
    private replicationSessionService: ReplicationSessionService = new ReplicationSessionService(
        v4,
        new ReplicationSessionStorageMemory()
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
    private startDataCollector: StartDataCollector = new StartDataCollector(
        this.audioStateUseCase,
        this.conversationUseCase,
        this.startUseCase,
        new LanguageUseCase(
            this.languageTranslationClient,
            this.languageCache
        ),
        this.startReplicationUseCase
    );
    private audioAbortHandler: AudioAbortHandler = new AudioAbortHandler(this.startAdapter, this.inputUseCase, this.conversationUseCase, this.startUseCase);

    private audioFeedbackUseCase: AudioFeedbackUseCase = new AudioFeedbackUseCase(
        this.audioFeedbackClientBrowser
    );
    private audioInputHandlerStandbyReceiver: AudioInputHandlerStandbyReceiver = new AudioInputHandlerStandbyReceiver(this.inputUseCase);
    private audioInputHandlerConversationInputHandler: AudioInputHandlerConversationInputHandler = new AudioInputHandlerConversationInputHandler(
        this.conversationUseCase,
        this.startUseCase
    );
    private audioInputHandler: AudioInputHandler = new AudioInputHandler(
        this.startAdapter,
        this.inputUseCase,
        this.audioTransformUseCase,
        [
            this.audioInputHandlerStandbyReceiver,
            this.audioInputHandlerConversationInputHandler
        ],
        this.audioFeedbackUseCase
    );
    private playbackUseCase: PlaybackUseCase = new PlaybackUseCase(
        this.audioStorage
    );
    private audioOutputHandler: AudioOutputHandler = new AudioOutputHandler(
        this.startAdapter,
        this.playbackUseCase
    );
    private startHandler: StartHandler = new StartHandler(
        this.startUseCase,
        this.inputUseCase,
        this.conversationUseCase,
        this.startAdapter
    );
    private startControllerReplicationPollHandler: ReplicationPollHandler = new StartControllerReplicationPollHandler(
        this.timeHelper,
        this.startReplicationUseCase,
        this.config.replicationPollTime
    );
    public startController: StartController = new StartController(
        document,
        renderApplication,
        Start,
        this.startUseCase,
        this.startPresenter,
        [],
        [
            this.audioAbortHandler,
            this.audioInputHandler,
            this.audioOutputHandler,
            this.startHandler,
            this.audioInputHandlerConversationInputHandler,
            this.startControllerReplicationPollHandler
        ],
        this.startDataCollector,
        navigator.language,
        new InputUseCase(
            this.audioStorage,
            this.config.wakeupWords
        )
    );

    constructor() {
        ViewInjection(Start, this.startAdapter);
    }
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
