import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import StartReplicationUseCase from '../../../Core/Start/UseCase/StartReplicationUseCase';
import StartReplicationEntity from '../../../Core/Start/StartReplicationEntity';
import StartReplicationPresenter, {StartReplicationModel} from './StartReplicationPresenter';

export default class StartReplicationController {
    constructor(
        private startReplicationUseCase: StartReplicationUseCase,
        private startReplicationPresenter: StartReplicationPresenter
    ) {
    }

    public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        const sessionId: string = event.headers['session-id'] || '';

        if (!sessionId) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: 'Unauthorized: Session ID is missing'})
            };
        }

        try {
            const replicationData: StartReplicationEntity = await this.startReplicationUseCase.loadSessionData(sessionId);
            const replicationModel: StartReplicationModel = this.startReplicationPresenter.present(replicationData);
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replicationModel)
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: 'Unexpected error: ' + error})
            };
        }
    }
}
