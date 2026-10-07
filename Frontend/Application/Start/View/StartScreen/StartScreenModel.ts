interface I18n {
    startLabel: string;
    imageText: string;
    followerHint: string;
}

export default class StartScreenModel {
    public showStartButton: boolean = false;

    constructor(
        public i18n: I18n = <I18n>{}
    ) {
    }
}
