import LanguageCache from 'Core/I18n/LanguageCache';

export default class Memory implements LanguageCache {
    private cache: Record<string, JsonData> = {};

    public getTranslation(language: string): JsonData | undefined {
        return this.cache[language];
    }

    public setTranslation(language: string, translation: JsonData): void {
        this.cache[language] = translation;
    }
}

