import LanguageCache from 'Core/I18n/LanguageCache';

export default class Memory implements LanguageCache {
    private cache: Record<string, Json> = {};

    public getTranslation(language: string): Json | undefined {
        return this.cache[language];
    }

    public setTranslation(language: string, translation: Json): void {
        this.cache[language] = translation;
    }
}

