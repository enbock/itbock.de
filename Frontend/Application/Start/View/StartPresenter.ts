import StartModel from 'Application/Start/View/StartModel';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import StartScreenPresenter from 'Application/Start/View/StartScreen/StartScreenPresenter';
import OldPagePresenter from 'Application/Start/View/OldPage/OldPagePresenter';
import ConversationPresenter from 'Application/Start/View/Conversation/ConversationPresenter';
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
        const model: StartModel = new StartModel(data.i18n.start);

        model.showThinking = data.gptState.isLoading == true;
        model.showAudioText = data.audioState.isAudioPlaying == true;
        model.audioText = data.audioState.audioOutput.text;
        model.languageCode = data.startState.language.slice(0, 2);
        model.language = data.startState.language
            ? String(
                new Intl.DisplayNames([data.startState.language], {
                    type: 'language'
                }).of(data.startState.language)
            )
            : '';

        model.showStartScreen = data.replication.module == 'START_SCREEN';
        model.showOldPage = data.replication.module == 'OLD_PAGE';
        model.showConversation = data.replication.module == 'CONVERSATION';

        model.startScreen = this.startScreenPresenter.present(data);
        model.oldPage = this.oldPagePresenter.present(data);
        model.conversation = this.conversationPresenter.present(data);
        model.audio = this.audioPresenter.present(data);

        return model;
    }
}
