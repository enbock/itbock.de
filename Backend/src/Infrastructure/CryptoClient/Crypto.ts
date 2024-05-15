import CryptoClient from '../../Core/CryptoClient';
import crypto from 'crypto';

export default class Crypto implements CryptoClient {
    constructor(
        private cryptoLibrary: typeof crypto
    ) {
    }

    public generateRandomBytes(size: number): string {
        return this.cryptoLibrary.randomBytes(size).toString('hex');
    }
}
