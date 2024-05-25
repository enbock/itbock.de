export default interface LanguageCache {
    getTranslation(language: string): Json | undefined;
    setTranslation(language: string, translation: Json): void;
}

