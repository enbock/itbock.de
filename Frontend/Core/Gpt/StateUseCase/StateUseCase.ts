import Response from 'Core/Gpt/StateUseCase/Response';
import ConversationStorage from 'Core/Gpt/ConversationStorage';

export default class StateUseCase {
    constructor(
        private conversationStorage: ConversationStorage
    ) {
    }

    public getState(response: Response): void {
        response.isLoading = this.conversationStorage.getLoading();
    }
}
