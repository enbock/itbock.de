import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import LanguageUseCase from 'Core/I18n/UseCase/LanguageUseCase';

export default class DataCollector {
    constructor(
        private audioStateUseCase: AudioStateUseCase,
        private conversationUseCase: ConversationUseCase,
        private startUseCase: StartUseCase,
        private languageService: LanguageUseCase
    ) {
    }

    public async getData(): Promise<ResponseCollection> {
        const data: ResponseCollection = new ResponseCollection();

        this.conversationUseCase.getState(data.gptState);
        this.audioStateUseCase.getState(data.audioState);
        this.startUseCase.getState(data.startState);
        data.i18n = await this.languageService.getI18n(data.startState);

        return data;
    }
}
