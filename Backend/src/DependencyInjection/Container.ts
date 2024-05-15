import Handler from '../Application/Handler';
import MfaService from '../Core/Mfa/MfaService';
import S3TokenStore from '../Infrastructure/TokenStorage/S3TokenStore';
import TokenPresenter from '../Application/TokenPresenter';
import AWS from 'aws-sdk';
import {authenticator} from 'otplib';

export class Container {
    private appName: string = 'Bock-Laboratories';
    private s3: AWS.S3 = new AWS.S3();
    private tokenStore: S3TokenStore = new S3TokenStore(
        this.s3, process.env.S3_BUCKET_NAME!, process.env.S3_TOKEN_PATH!
    );
    private mfaService: MfaService = new MfaService(this.appName, this.tokenStore, authenticator);
    private tokenPresenter: TokenPresenter = new TokenPresenter();

    public handler: Handler = new Handler(this.mfaService, this.tokenPresenter);
}

const DependencyInjectionContainer: Container = new Container();
export default DependencyInjectionContainer;
