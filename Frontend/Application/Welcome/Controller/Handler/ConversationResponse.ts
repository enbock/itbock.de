import ConversationResponseInterface from 'Core/Gpt/GeneralConversationUseCase/ConversationResponse';

export default class ConversationResponse implements ConversationResponseInterface {
    public commands: Array<string> = [];
}
