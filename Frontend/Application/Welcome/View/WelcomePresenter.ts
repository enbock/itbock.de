import WelcomeModel from 'Application/Welcome/View/WelcomeModel';
import DataCollection from 'Application/Welcome/Controller/DataCollection';
import ConversationRecordEntity, {Role} from 'Core/Gpt/ConversationRecordEntity';

export default class WelcomePresenter {
    public present(data: DataCollection): WelcomeModel {
        const model: WelcomeModel = new WelcomeModel();

        model.showOldHomepages = data.welcomeState.linksShown;
        model.showStart = data.startState.applicationStarted == false && data.gptState.isLoading == false;
        model.conversations = data.gptState.conversations
            .map(e => e)
            .reverse()
            .filter(c => c.text.trim().length > 0)
            .map(c => this.presentConversation(c))
        ;
        model.showConversation = data.welcomeState.linksShown == false && data.startState.applicationStarted == true;

        return model;
    }

    private presentConversation(conversation: ConversationRecordEntity): string {
        const map: Record<Role, string> = {
            assistant: 'Assistent',
            user: 'Benutzer'
        };
        return map[conversation.role] + ': ' + conversation.text;
    }
}
