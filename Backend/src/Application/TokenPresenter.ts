export class TokenPresenter {
    public formatTokenResponse(token: string, secret: string, userId: string, issuer: string): string {
        const label = `${issuer}:${userId}`;
        const otpauth = `otpauth://totp/${label}?secret=${secret}&issuer=${issuer}`;

        return JSON.stringify({
            message: 'Token generated',
            token,
            otpauth
        });
    }
}
