interface I18n {
    startLabel: string;
    imageText: string;
}

export default class StartScreenModel {
    constructor(
        public i18n: I18n = <I18n>{}
    ) {
    }
}
