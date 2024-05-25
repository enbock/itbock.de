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
            .map(c => this.presentConversation(c))
        ;

        return model;
    }

    private presentConversation(conversation: ConversationEntity): string {
        const map: Record<Role, string> = {
            assistant: 'Assistent',
            user: 'Benutzer',
            system: 'System'
        };
        return map[conversation.role] + ': ' + conversation.text;
    }
}
