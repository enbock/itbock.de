export default class TokenPresenter {
    public formatTokenResponse(authUri: string): string {
        // noinspection SpellCheckingInspection
        return JSON.stringify({
            otpauth: authUri
        });
    }
}
