import LanguageTranslationClient from 'Core/I18n/LanguageTranslationClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import Method from 'Infrastructure/ApiHelper/Method';

export default class Rest implements LanguageTranslationClient {
    constructor(
        private serviceUrl: string,
        private fetchHelper: FetchHelper
    ) {
    }

    public async translate(data: Json, language: string): Promise<Json> {
        const body: string = JSON.stringify({data: data, language: language});
        const response: Response = await fetch(
            this.serviceUrl,
            this.fetchHelper.createHeader(Method.POST, body)
        );

        if (!this.fetchHelper.isResponseSuccessful(response)) {
            console.error('Translation failed');
            return data;
        }

        return (await response.json()).data;
    }
}

