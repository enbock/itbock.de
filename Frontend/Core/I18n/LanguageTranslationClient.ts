export default interface LanguageTranslationClient {
    translate(data: Json, language: string): Promise<Json>;
}

