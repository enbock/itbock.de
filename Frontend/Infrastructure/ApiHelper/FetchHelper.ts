import Method from './Method';

export class RequestError extends Error {
}

export default class FetchHelper {
    public createHeader(method: Method, body?: BodyInit, headers: any = {}): RequestInit {
        const isFileUpload: boolean = body instanceof FormData;
        const headerOptions: any = headers || {};
        if (!isFileUpload && body) {
            headerOptions['content-type'] = 'application/json';
        }
        const headerData: RequestInit = {
            headers: new Headers(headerOptions),
            method: method,
            mode: 'cors'
        } as RequestInit;
        if (body) {
            headerData.body = body;
        }
        return headerData;
    }

    public isResponseSuccessful(response: Response): boolean {
        return response.status >= 200 && response.status < 300;
    }

    public assertSuccess(response: Response): void {
        if (this.isResponseSuccessful(response)) return;

        throw new RequestError();
    }
}
