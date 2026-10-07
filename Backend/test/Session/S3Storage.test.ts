import assert from 'node:assert/strict';
import test from 'node:test';
import {DeleteObjectCommandInput, GetObjectCommandInput, PutObjectCommandInput, S3} from '@aws-sdk/client-s3';
import ReplicationConflictError from '../../src/Core/Start/ReplicationConflictError';
import StartReplicationEntity from '../../src/Core/Start/StartReplicationEntity';
import ParseHelper from '../../src/ParseHelper';
import ReplicationEncoder from '../../src/Infrastructure/Start/ReplicationStorage/S3/ReplicationEncoder';
import ReplicationParser from '../../src/Infrastructure/Start/ReplicationStorage/S3/ReplicationParser';
import S3Storage from '../../src/Infrastructure/Start/ReplicationStorage/S3/S3Storage';

class FakeS3 {
    public getObjectCalls: Array<GetObjectCommandInput> = [];
    public putObjectCalls: Array<PutObjectCommandInput> = [];
    public deleteObjectCalls: Array<DeleteObjectCommandInput> = [];
    public nextGetError: Error | null = null;
    public nextPutError: Error | null = null;
    public nextGetResult: {
        Body?: {
            transformToString: () => Promise<string>;
        };
        ETag?: string;
    } = {};

    public async getObject(params: GetObjectCommandInput): Promise<{
        Body?: {
            transformToString: () => Promise<string>;
        };
        ETag?: string;
    }> {
        this.getObjectCalls.push(params);

        if (this.nextGetError !== null) {
            throw this.nextGetError;
        }

        return this.nextGetResult;
    }

    public async putObject(params: PutObjectCommandInput): Promise<void> {
        this.putObjectCalls.push(params);

        if (this.nextPutError !== null) {
            throw this.nextPutError;
        }
    }

    public async deleteObject(params: DeleteObjectCommandInput): Promise<void> {
        this.deleteObjectCalls.push(params);
    }
}

function createStorage(fakeS3: FakeS3): S3Storage {
    return new S3Storage(
        fakeS3 as unknown as S3,
        'bucket-name',
        'session-prefix/',
        new ReplicationParser(new ParseHelper()),
        new ReplicationEncoder()
    );
}

test('S3Storage.loadSessionData returns defaults for NoSuchKey', async (): Promise<void> => {
    const fakeS3: FakeS3 = new FakeS3();
    const storage: S3Storage = createStorage(fakeS3);

    fakeS3.nextGetError = Object.assign(new Error('missing'), {name: 'NoSuchKey'});

    const loadResult = await storage.loadSessionData('550e8400-e29b-41d4-a716-446655440000');

    assert.equal(loadResult.revisionToken, null);
    assert.equal(loadResult.session.version, 0);
    assert.equal(loadResult.session.persisted, false);
    assert.equal(
        fakeS3.getObjectCalls[0].Key,
        'session-prefix/550e8400-e29b-41d4-a716-446655440000.json'
    );
});

test('S3Storage.loadSessionData parses transformed bodies and returns the ETag', async (): Promise<void> => {
    const fakeS3: FakeS3 = new FakeS3();
    const storage: S3Storage = createStorage(fakeS3);

    fakeS3.nextGetResult = {
        Body: {
            transformToString: async (): Promise<string> => JSON.stringify({
                version: 7,
                module: 'INFO',
                language: 'de-DE',
                busy: false,
                busySince: null,
                conversations: [
                    {
                        role: 'assistant',
                        text: 'Antwort',
                        language: 'de-DE'
                    }
                ],
                documents: [
                    {
                        id: 'doc-1',
                        title: 'Titel',
                        text: 'Inhalt',
                        url: null
                    }
                ]
            })
        },
        ETag: '"etag-1"'
    };

    const loadResult = await storage.loadSessionData('550e8400-e29b-41d4-a716-446655440000');

    assert.equal(loadResult.revisionToken, '"etag-1"');
    assert.equal(loadResult.session.persisted, true);
    assert.equal(loadResult.session.version, 7);
    assert.equal(loadResult.session.module, 'INFO');
    assert.equal(loadResult.session.conversations[0].text, 'Antwort');
});

test('S3Storage.loadSessionData propagates unexpected errors', async (): Promise<void> => {
    const fakeS3: FakeS3 = new FakeS3();
    const storage: S3Storage = createStorage(fakeS3);

    fakeS3.nextGetError = Object.assign(new Error('denied'), {name: 'AccessDenied'});

    await assert.rejects(
        async (): Promise<void> => {
            await storage.loadSessionData('550e8400-e29b-41d4-a716-446655440000');
        },
        /denied/
    );
});

test('S3Storage.saveSessionData uses conditional writes for new and existing sessions', async (): Promise<void> => {
    const fakeS3: FakeS3 = new FakeS3();
    const storage: S3Storage = createStorage(fakeS3);
    const sessionData: StartReplicationEntity = new StartReplicationEntity();

    sessionData.version = 1;

    await storage.saveSessionData('550e8400-e29b-41d4-a716-446655440000', sessionData, null);
    await storage.saveSessionData('550e8400-e29b-41d4-a716-446655440000', sessionData, '"etag-1"');

    assert.equal(fakeS3.putObjectCalls[0].IfNoneMatch, '*');
    assert.equal(fakeS3.putObjectCalls[0].IfMatch, undefined);
    assert.equal(fakeS3.putObjectCalls[1].IfMatch, '"etag-1"');
    assert.equal(fakeS3.putObjectCalls[1].IfNoneMatch, undefined);
    assert.equal(
        fakeS3.putObjectCalls[0].Key,
        'session-prefix/550e8400-e29b-41d4-a716-446655440000.json'
    );
});

test('S3Storage.saveSessionData maps precondition failures to ReplicationConflictError', async (): Promise<void> => {
    const fakeS3: FakeS3 = new FakeS3();
    const storage: S3Storage = createStorage(fakeS3);

    fakeS3.nextPutError = Object.assign(new Error('conflict'), {
        name: 'PreconditionFailed',
        $metadata: {
            httpStatusCode: 412
        }
    });

    await assert.rejects(
        async (): Promise<void> => {
            await storage.saveSessionData(
                '550e8400-e29b-41d4-a716-446655440000',
                new StartReplicationEntity(),
                '"etag-1"'
            );
        },
        ReplicationConflictError
    );
});
