import {CryptoClient} from '../CryptoClient';
import {TokenStorage} from '../TokenStorage';
import {totp} from 'otplib';

export class MfaService {
    constructor(
        private cryptoClient: CryptoClient,
        private tokenStore: TokenStorage
    ) {
        totp.options = {
            digits: 6,
            step: 30,
            window: 1
        };
    }

    public generateSecret(): string {
        return this.cryptoClient.generateRandomBytes(20);
    }

    public async createToken(userId: string, secret: string): Promise<string> {
        const token: string = totp.generate(secret);
        await this.tokenStore.setToken(userId, secret);
        console.log(`Generated token for user ${userId}: ${token}`);
        return token;
    }

    public async validateToken(userId: string, token: string): Promise<boolean> {
        const secret: string | undefined = await this.tokenStore.getToken(userId);

        if (!secret) {
            return false;
        }

        return totp.check(token, secret);
    }
}
