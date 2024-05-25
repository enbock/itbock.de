import AudioModel from 'Application/Start/View/Audio/AudioModel';
import ConversationModel from 'Application/Start/View/Conversation/ConversationModel';
import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';
import StartScreenModel from 'Application/Start/View/StartScreen/StartScreenModel';

export default class StartModel {
    public showThinking: boolean = false;
    public showAudioText: boolean = false;
    public audioText: string = '';
    public language: string = '';
    public showStartScreen: boolean = false;
    public showConversation: boolean = false;
    public showOldPage: boolean = false;
    public audio: AudioModel = new AudioModel();
    public conversation: ConversationModel = new ConversationModel();
    public oldPage: OldPageModel = new OldPageModel();
    public startScreen: StartScreenModel = new StartScreenModel();
}
