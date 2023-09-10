import RunResponse from 'Core/Gpt/GeneralConversationUseCase/RunResponse';
import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default class ConversationResponse implements RunResponse {
    public conversation: ConversationEntity = new ConversationEntity();
}
