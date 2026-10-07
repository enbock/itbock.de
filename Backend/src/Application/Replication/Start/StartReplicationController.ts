import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import InvalidSessionIdError from '../../../Core/Start/InvalidSessionIdError';
import SessionId from '../../../Core/Start/SessionId';
import StartReplicationUseCase from '../../../Core/Start/UseCase/StartReplicationUseCase';
import StartReplicationEntity from '../../../Core/Start/StartReplicationEntity';
import StartReplicationPresenter, {StartReplicationModel} from './StartReplicationPresenter';

export default class StartReplicationController {
    private readonly responseHeaders: Record<string, string> = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    constructor(
        private startReplicationUseCase: StartReplicationUseCase,
        private startReplicationPresenter: StartReplicationPresenter
    ) {
    }

    public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const sessionId: string = this.getHeaderValue(event, 'session-id');

        if (!sessionId) {
            return {
                statusCode: 401,
                headers: this.responseHeaders,
                body: JSON.stringify({message: 'Unauthorized: Session ID is missing'})
            };
        }

        try {
            const normalizedSessionId: string = SessionId.normalize(sessionId);
            const replicationData: StartReplicationEntity =
                await this.startReplicationUseCase.loadSessionData(normalizedSessionId);

            if (replicationData.persisted && this.isMatchingVersion(event, replicationData.version)) {
                return {
                    statusCode: 204,
                    headers: this.responseHeaders,
                    body: ''
                };
            }

            const replicationModel: StartReplicationModel = this.startReplicationPresenter.present(replicationData);

            return {
                statusCode: 200,
                headers: this.responseHeaders,
                body: JSON.stringify(replicationModel)
            };
        } catch (error) {
            if (error instanceof InvalidSessionIdError) {
                return {
                    statusCode: 400,
                    headers: this.responseHeaders,
                    body: JSON.stringify({message: error.message})
                };
            }

            console.error('Unexpected start replication error', error);
            return {
                statusCode: 500,
                headers: this.responseHeaders,
                body: JSON.stringify({message: 'Unexpected error'})
            };
        }
    }

    private getHeaderValue(event: APIGatewayProxyEvent, headerName: string): string {
        const headerEntry: [string, string | undefined] | undefined = Object.entries(event.headers || {}).find(
            ([name]: [string, string | undefined]): boolean => name.toLowerCase() === headerName.toLowerCase()
        );

        return headerEntry?.[1] || '';
    }

    private isMatchingVersion(event: APIGatewayProxyEvent, currentVersion: number): boolean {
        const versionParameter: string | undefined = event.queryStringParameters?.version;

        if (versionParameter === undefined) {
            return false;
        }

        const parsedVersion: number = Number(versionParameter);

        return Number.isInteger(parsedVersion) && parsedVersion === currentVersion;
    }
}
