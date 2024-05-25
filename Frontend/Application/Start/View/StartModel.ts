import AudioModel from 'Application/Start/View/Audio/AudioModel';
import ConversationModel from 'Application/Start/View/Conversation/ConversationModel';
import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';
import StartScreenModel from 'Application/Start/View/StartScreen/StartScreenModel';

class I18n {
    public pageTitle: string = 'Bock Laboratories - Terminal';
    public loadingText: string = 'Ich denke, bitte warten...';
}

export default class StartModel {
    public showThinking: boolean = false;
    public showAudioText: boolean = false;
    public audioText: string = '';
    public language: string = '';
    public languageCode: string = '';
    public showStartScreen: boolean = false;
    public showConversation: boolean = false;
    public showOldPage: boolean = false;
    public audio: AudioModel = new AudioModel();
    public conversation: ConversationModel = new ConversationModel();
    public oldPage: OldPageModel = new OldPageModel();
    public startScreen: StartScreenModel = new StartScreenModel();
    public i18n: I18n = new I18n();
}
