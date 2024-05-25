import StartModel from 'Application/Start/View/StartModel';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import StartScreenPresenter from 'Application/Start/View/StartScreen/StartScreenPresenter';
import OldPagePresenter from 'Application/Start/View/OldPage/OldPagePresenter';
import ConversationPresenter from 'Application/Start/View/Conversation/ConversationPresenter';
import Modules from 'Core/Start/Modules';
import AudioPresenter from 'Application/Start/View/Audio/AudioPresenter';

export default class StartPresenter {
    constructor(
        private startScreenPresenter: StartScreenPresenter,
        private oldPagePresenter: OldPagePresenter,
        private conversationPresenter: ConversationPresenter,
        private audioPresenter: AudioPresenter
    ) {
    }

    public presentData(data: ResponseCollection): StartModel {
        const model: StartModel = new StartModel();

        model.i18n.loadingText = data.i18n.start.loadingText;
        model.i18n.pageTitle = data.i18n.start.pageTitle;

        model.showThinking = data.gptState.isLoading == true;
        model.showAudioText = data.audioState.isPlaying == true && data.audioState.isLoading == false;
        model.audioText = data.audioState.audioOutput.text;
        model.languageCode = data.startState.language.slice(0, 2);
        model.language = data.startState.language
            ? String(
                new Intl.DisplayNames([data.startState.language], {
                    type: 'language'
                }).of(data.startState.language)
            )
            : '';

        model.showStartScreen = data.startState.module == Modules.START_SCREEN;
        model.showOldPage = data.startState.module == Modules.OLD_PAGE;
        model.showConversation = data.startState.module == Modules.CONVERSATION;

        model.startScreen = this.startScreenPresenter.present(data);
        model.oldPage = this.oldPagePresenter.present(data);
        model.conversation = this.conversationPresenter.present(data);
        model.audio = this.audioPresenter.present(data);

        return model;
    }
}
