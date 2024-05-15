import {authenticator} from 'otplib';
import {TOTPOptions} from '@otplib/core';
import TokenStorage from '../TokenStorage';

export default class MfaService {
    constructor(
        private appName: string,
        private tokenStore: TokenStorage,
        private authenticatorLibrary: typeof authenticator,
        totpConfig: Partial<TOTPOptions> = {
            digits: 6,
            step: 30,
            window: 1
        }
    ) {
        this.authenticatorLibrary.options = totpConfig;
    }

    public async createToken(userId: string): Promise<string> {
        const secret: string = this.authenticatorLibrary.generateSecret();
        await this.tokenStore.setToken(userId, secret);
        const token: string = this.authenticatorLibrary.generate(secret);
        console.log(`Generated token for user ${userId}: ${token}`);
        return this.authenticatorLibrary.keyuri(userId, this.appName, secret);
    }

    public async validateToken(userId: string, token: string): Promise<boolean> {
        const secret: string | undefined = await this.tokenStore.getToken(userId);

        if (!secret) {
            return false;
        }

        return this.authenticatorLibrary.check(token, secret);
    }
}
