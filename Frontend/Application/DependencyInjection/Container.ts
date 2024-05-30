import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import ParseHelper from 'Infrastructure/ParseHelper';
import StartControllerController from 'Application/Start/Controller/Controller';
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
import PlaybackUseCase from 'Core/Audio/PlaybackUseCase/PlaybackUseCase';
import GptClient from 'Core/Gpt/GptClient';
import NetworkGptClient from 'Infrastructure/GptClient/Network/Network';
import Encoder from 'Infrastructure/GptClient/Network/Encoder';
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
import EndOfTopicCase from 'Infrastructure/GptClient/Fake/Cases/EndOfTopicCase';
import MuteMicrophone from 'Infrastructure/GptClient/Fake/Cases/MuteMicrophone';
import OldHomepage from 'Infrastructure/GptClient/Fake/Cases/OldHomepage';
import LanguageCacheMemory from 'Infrastructure/I18n/Cache/Memory';
import LanguageTranslationClientRest from 'Infrastructure/I18n/Rest/LanguageTranslationClient';
import LanguageUseCase from 'Core/I18n/UseCase/LanguageUseCase';
import AudioFeedbackUseCase from 'Core/Audio/FeedbackUseCase/FeedbackUseCase';
import AudioFeedbackClientBrowser from 'Infrastructure/Audio/Feedback/Client/Browser/Browser';
import {FEEDBACK} from 'Core/Audio/AudioFeedbackClient';

class Container {
    private config: Config = new Config();
    private fetchHelper: FetchHelper = new FetchHelper();
    private parseHelper: ParseHelper = new ParseHelper();
    private audioTransformClient: AudioTransformClient = new NetworkAudioTransformClient(
        this.fetchHelper,
        this.config.transformUrl
    );
    private encoder: Encoder = new Encoder();
    private gptClient: GptClient = this.config.useFakeApi
        ? new Fake(
            [
                new StartCase(),
                new EndOfTopicCase(),
                new MuteMicrophone(),
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
        this.config.wakeupWords,
        this.startStorage
    );
    private audioStateUseCase: AudioStateUseCase = new AudioStateUseCase(
        this.startStorage,
        this.audioService,
        this.audioStorage
    );
    private playbackUseCase: PlaybackUseCase = new PlaybackUseCase(
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
    private startPresenter: StartPresenter = new StartPresenter(
        new StartScreenPresenter(),
        new OldPagePresenter(),
        new ConversationPresenter(),
        new AudioPresenter()
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
        )
    );
    private startAdapter: StartAdapter = new StartAdapter();
    private audioAbortHandler: AudioAbortHandler = new AudioAbortHandler(this.startAdapter, this.inputUseCase, this.conversationUseCase, this.startUseCase);

    private audioFeedbackUseCase: AudioFeedbackUseCase = new AudioFeedbackUseCase(
        this.audioFeedbackClientBrowser
    );
    private audioInputHandlerStandbyReceiver: AudioInputHandlerStandbyReceiver = new AudioInputHandlerStandbyReceiver(this.inputUseCase);
    private audioInputHandlerConversationInputHandler: AudioInputHandlerConversationInputHandler = new AudioInputHandlerConversationInputHandler(
        this.conversationUseCase,
        this.startUseCase,
        this.inputUseCase
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
    public startControllerController: StartControllerController = new StartControllerController(
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
            this.audioInputHandlerConversationInputHandler
        ],
        this.startDataCollector,
        navigator.language,
        new InputUseCase(
            this.audioStorage,
            this.config.wakeupWords,
            this.startStorage
        )
    );

    constructor() {
        ViewInjection(Start, this.startAdapter);
    }
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
