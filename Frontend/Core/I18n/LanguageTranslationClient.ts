export default interface LanguageTranslationClient {
    translate(data: JsonData, language: string): Promise<JsonData>;
}

