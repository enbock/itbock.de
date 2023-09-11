import Method from './Method';

export default class FetchHelper {
    public createHeader(method: Method, body?: BodyInit): RequestInit {
        const isFileUpload: boolean = body instanceof FormData;
        const headers: any = {};
        if (!isFileUpload && body) {
            headers['content-type'] = 'application/json';
        }
        const headerData: RequestInit = {
            headers: new Headers(headers),
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
}
