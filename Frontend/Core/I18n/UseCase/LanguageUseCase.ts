import AllTranslation from 'Core/I18n/AllTranslation';
import LanguageTranslationClient from 'Core/I18n/LanguageTranslationClient';
import LanguageCache from 'Core/I18n/LanguageCache';
import TranslationRequest from 'Core/I18n/UseCase/TranslationRequest';

export default class LanguageUseCase {
    constructor(
        private languageTranslationClient: LanguageTranslationClient,
        private cache: LanguageCache
    ) {
        this.cache.setTranslation('de', AllTranslation);
    }

    public async getI18n(request: TranslationRequest): Promise<JsonData> {
        if (request.language == '') return AllTranslation;

        const language: string = request.language.slice(0, 2);
        const translation: JsonData = this.cache.getTranslation(language);
        if (translation) return translation;

        const translated: JsonData = await this.languageTranslationClient.translate(AllTranslation, language);
        this.cache.setTranslation(language, translated);

        return translated;
    }
}
