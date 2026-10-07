import assert from 'node:assert/strict';
import test from 'node:test';
import {APIGatewayProxyEvent} from 'aws-lambda';
import StartReplicationController from '../../src/Application/Replication/Start/StartReplicationController';
import StartReplicationPresenter from '../../src/Application/Replication/Start/StartReplicationPresenter';
import StartReplicationEntity from '../../src/Core/Start/StartReplicationEntity';
import StartReplicationUseCase from '../../src/Core/Start/UseCase/StartReplicationUseCase';

class FakeStartReplicationUseCase {
    public result: StartReplicationEntity = new StartReplicationEntity();

    public async loadSessionData(): Promise<StartReplicationEntity> {
        return this.result;
    }
}

function createEvent(overrides: Partial<APIGatewayProxyEvent>): APIGatewayProxyEvent {
    return {
        body: null,
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'GET',
        isBase64Encoded: false,
        path: '/replication/start',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as APIGatewayProxyEvent['requestContext'],
        resource: '/replication/start',
        ...overrides
    };
}

test('StartReplicationController returns 401 when the session id header is missing', async (): Promise<void> => {
    const controller: StartReplicationController = new StartReplicationController(
        new FakeStartReplicationUseCase() as unknown as StartReplicationUseCase,
        new StartReplicationPresenter()
    );

    const response = await controller.handle(createEvent({}));

    assert.equal(response.statusCode, 401);
});

test('StartReplicationController returns 400 for invalid session ids', async (): Promise<void> => {
    const controller: StartReplicationController = new StartReplicationController(
        new FakeStartReplicationUseCase() as unknown as StartReplicationUseCase,
        new StartReplicationPresenter()
    );

    const response = await controller.handle(
        createEvent({
            headers: {
                'session-id': 'invalid-session-id'
            }
        })
    );

    assert.equal(response.statusCode, 400);
});

test('StartReplicationController returns 200 for unknown sessions even when version matches zero', async (): Promise<void> => {
    const useCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();
    const controller: StartReplicationController = new StartReplicationController(
        useCase as unknown as StartReplicationUseCase,
        new StartReplicationPresenter()
    );

    useCase.result.version = 0;
    useCase.result.module = 'START_SCREEN';
    useCase.result.language = 'de-DE';
    useCase.result.persisted = false;

    const response = await controller.handle(
        createEvent({
            headers: {
                'Session-Id': '550E8400-E29B-41D4-A716-446655440000'
            },
            queryStringParameters: {
                version: '0'
            }
        })
    );

    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), {
        version: 0,
        module: 'START_SCREEN',
        language: 'de-DE',
        busy: false,
        conversations: [],
        documents: []
    });
});

test('StartReplicationController returns 204 for unchanged known sessions', async (): Promise<void> => {
    const useCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();
    const controller: StartReplicationController = new StartReplicationController(
        useCase as unknown as StartReplicationUseCase,
        new StartReplicationPresenter()
    );

    useCase.result.version = 3;
    useCase.result.module = 'INFO';
    useCase.result.language = 'de-DE';
    useCase.result.persisted = true;

    const response = await controller.handle(
        createEvent({
            headers: {
                'session-id': '550e8400-e29b-41d4-a716-446655440000'
            },
            queryStringParameters: {
                version: '3'
            }
        })
    );

    assert.equal(response.statusCode, 204);
    assert.equal(response.body, '');
});
