export default interface LanguageCache {
    getTranslation(language: string): JsonData | undefined;

    setTranslation(language: string, translation: JsonData): void;
}

