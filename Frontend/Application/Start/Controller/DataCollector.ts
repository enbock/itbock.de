import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';

export default class DataCollector {
    constructor(
        private audioStateUseCase: AudioStateUseCase,
        private conversationUseCase: ConversationUseCase,
        private startUseCase: StartUseCase
    ) {
    }

    public getData(): ResponseCollection {
        const data: ResponseCollection = new ResponseCollection();

        this.conversationUseCase.getState(data.gptState);
        this.audioStateUseCase.getState(data.audioState);
        this.startUseCase.getState(data.startState);

        return data;
    }
}
