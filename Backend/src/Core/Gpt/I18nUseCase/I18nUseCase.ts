import TranslationRequest from './TranslationRequest';
import TranslationResponse from './TranslationResponse';
import GptBackend from '../GptBackend';

export default class I18nUseCase {
    constructor(
        private backend: GptBackend
    ) {
    }

    public async translate(request: TranslationRequest, response: TranslationResponse): Promise<void> {
        response.data = await this.backend.translate(request.language, request.data);
    }
}
