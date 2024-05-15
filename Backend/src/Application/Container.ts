import {Handler} from './Handler';
import {MfaService} from '../Core/Mfa/MfaService';
import {Crypto} from '../Infrastructure/CryptoClient/Crypto';
import {S3TokenStore} from '../Infrastructure/TokenStorage/S3TokenStore';
import {TokenPresenter} from './TokenPresenter';
import AWS from 'aws-sdk';
import crypto from 'crypto';

class Container {
    private cryptoService: Crypto = new Crypto(crypto);
    private s3: AWS.S3 = new AWS.S3();
    private tokenStore: S3TokenStore = new S3TokenStore(this.s3, process.env.S3_BUCKET_NAME!);
    private mfaService: MfaService = new MfaService(this.cryptoService, this.tokenStore);
    private tokenPresenter: TokenPresenter = new TokenPresenter();

    public handler: Handler = new Handler(this.mfaService, this.tokenPresenter);
}

const DependencyInjectionContainer = new Container();
export default DependencyInjectionContainer;
