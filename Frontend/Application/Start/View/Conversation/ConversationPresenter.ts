import ConversationEntity, {Role} from 'Core/Gpt/ConversationEntity';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import ConversationModel from 'Application/Start/View/Conversation/ConversationModel';

export default class ConversationPresenter {
    public present(data: ResponseCollection): ConversationModel {
        const model: ConversationModel = new ConversationModel();

        model.conversations = data.gptState.conversations
            .map(e => e)
            .reverse()
            .filter(c => c.text.trim().length > 0)
            .map(c => this.presentConversation(c, data))
        ;

        return model;
    }

    private presentConversation(conversation: ConversationEntity, data: ResponseCollection): string {
        const i18n: Json = data.i18n.conversation;
        const map: Record<Role, string> = {
            assistant: i18n.assistant,
            user: i18n.user,
            system: i18n.system
        };
        return map[conversation.role] + ': ' + conversation.text;
    }
}
