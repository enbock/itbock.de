import assert from 'node:assert/strict';
import test from 'node:test';
import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import BodyParser from '../../src/Application/Gpt/BodyParser';
import GptController from '../../src/Application/Gpt/GptController';
import GptPresenter from '../../src/Application/Gpt/GptPresenter';
import GptEntity from '../../src/Core/Gpt/GptEntity';
import GptUseCase from '../../src/Core/Gpt/UseCase/GptUseCase';
import ParseHelper from '../../src/ParseHelper';
import InvalidSessionIdError from '../../src/Core/Start/InvalidSessionIdError';
import SessionBusyError from '../../src/Core/Start/SessionBusyError';

class FakeGptUseCase {
    public result: GptEntity = new GptEntity();
    public error: Error | null = null;
    public executeCalls: Array<{
        sessionId?: string;
    }> = [];

    public async execute(_pastConversation: Array<unknown>, sessionId?: string): Promise<GptEntity> {
        this.executeCalls.push({sessionId});

        if (this.error !== null) {
            throw this.error;
        }

        return this.result;
    }
}

function createEvent(overrides: Partial<APIGatewayProxyEvent>): APIGatewayProxyEvent {
    return {
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    language: 'de-DE',
                    content: 'Hallo'
                }
            ]
        }),
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'POST',
        isBase64Encoded: false,
        path: '/gpt',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as APIGatewayProxyEvent['requestContext'],
        resource: '/gpt',
        ...overrides
    };
}

test('GptController returns 400 for invalid session ids and keeps CORS headers', async (): Promise<void> => {
    const useCase: FakeGptUseCase = new FakeGptUseCase();
    const controller: GptController = new GptController(
        useCase as unknown as GptUseCase,
        new BodyParser(new ParseHelper()),
        new GptPresenter()
    );

    const response = await controller.main(
        createEvent({
            headers: {
                'Session-Id': 'invalid'
            }
        }),
        {} as Context
    );

    assert.equal(response.statusCode, 400);
    assert.equal(response.headers['Access-Control-Allow-Origin'], '*');
    assert.equal(response.headers['Content-Type'], 'application/json');
    assert.deepStrictEqual(JSON.parse(response.body), {
        message: new InvalidSessionIdError().message
    });
    assert.equal(useCase.executeCalls.length, 0);
});

test('GptController returns 409 for busy sessions and normalizes the session id header', async (): Promise<void> => {
    const useCase: FakeGptUseCase = new FakeGptUseCase();
    const controller: GptController = new GptController(
        useCase as unknown as GptUseCase,
        new BodyParser(new ParseHelper()),
        new GptPresenter()
    );

    useCase.error = new SessionBusyError();

    const response = await controller.main(
        createEvent({
            headers: {
                'Session-Id': '550E8400-E29B-41D4-A716-446655440000'
            }
        }),
        {} as Context
    );

    assert.equal(useCase.executeCalls[0].sessionId, '550e8400-e29b-41d4-a716-446655440000');
    assert.equal(response.statusCode, 409);
    assert.equal(response.headers['Access-Control-Allow-Origin'], '*');
    assert.equal(response.headers['Content-Type'], 'application/json');
    assert.deepStrictEqual(JSON.parse(response.body), {
        message: new SessionBusyError().message
    });
});
