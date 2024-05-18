import Response from 'Core/Gpt/StateUseCase/Response';
import ConversationRecordEntity from 'Core/Gpt/ConversationRecordEntity';

export default class GptStateResponse implements Response {
    public isLoading: boolean = false;
    public conversations: Array<ConversationRecordEntity> = [];
}
