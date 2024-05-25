import StateResponse from 'Core/Gpt/ConversationUseCase/Response/StateResponse';
import ConversationEntity from 'Core/Gpt/ConversationEntity';

export default class GptStateResponse implements StateResponse {
    public isLoading: boolean = false;
    public conversations: Array<ConversationEntity> = [];
}
