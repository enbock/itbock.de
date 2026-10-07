import assert from 'node:assert/strict';
import test from 'node:test';
import StartReplicationConversationEntryEntity from '../../src/Core/Start/StartReplicationConversationEntryEntity';
import StartReplicationDocumentEntity from '../../src/Core/Start/StartReplicationDocumentEntity';
import StartReplicationEntity from '../../src/Core/Start/StartReplicationEntity';
import ParseHelper from '../../src/ParseHelper';
import ReplicationEncoder from '../../src/Infrastructure/Start/ReplicationStorage/S3/ReplicationEncoder';
import ReplicationParser from '../../src/Infrastructure/Start/ReplicationStorage/S3/ReplicationParser';

test('ReplicationParser and ReplicationEncoder round-trip session data', (): void => {
    const entity: StartReplicationEntity = new StartReplicationEntity();

    entity.persisted = true;
    entity.version = 12;
    entity.updatedAt = new Date('2026-10-07T14:48:00.000Z');
    entity.module = 'INFO';
    entity.language = 'de-DE';
    entity.busy = true;
    entity.busySince = new Date('2026-10-07T14:49:00.000Z');
    entity.appendConversation(
        new StartReplicationConversationEntryEntity('assistant', 'Hallo', 'de-DE')
    );
    entity.setDocuments(
        [
            new StartReplicationDocumentEntity('about-endre#0', 'Über Endre', 'Text', null)
        ]
    );

    const encoder: ReplicationEncoder = new ReplicationEncoder();
    const parser: ReplicationParser = new ReplicationParser(new ParseHelper());
    const encodedData: string = encoder.encodeReplication(entity);
    const parsedEntity: StartReplicationEntity = parser.parseReplication(encodedData);

    assert.equal(parsedEntity.version, 12);
    assert.equal(parsedEntity.updatedAt?.toISOString(), '2026-10-07T14:48:00.000Z');
    assert.equal(parsedEntity.module, 'INFO');
    assert.equal(parsedEntity.language, 'de-DE');
    assert.equal(parsedEntity.busy, true);
    assert.equal(parsedEntity.busySince?.toISOString(), '2026-10-07T14:49:00.000Z');
    assert.deepEqual(
        parsedEntity.conversations.map(
            (conversation: StartReplicationConversationEntryEntity): object => ({
                role: conversation.role,
                text: conversation.text,
                language: conversation.language
            })
        ),
        [
            {
                role: 'assistant',
                text: 'Hallo',
                language: 'de-DE'
            }
        ]
    );
    assert.deepEqual(
        parsedEntity.documents.map(
            (document: StartReplicationDocumentEntity): object => ({
                id: document.id,
                title: document.title,
                text: document.text,
                url: document.url
            })
        ),
        [
            {
                id: 'about-endre#0',
                title: 'Über Endre',
                text: 'Text',
                url: null
            }
        ]
    );
});

test('ReplicationParser falls back to defaults for invalid payloads', (): void => {
    const parser: ReplicationParser = new ReplicationParser(new ParseHelper());
    const parsedEntity: StartReplicationEntity = parser.parseReplication(
        '{"version":"wrong","module":"INVALID","busy":"yes","conversations":"bad","documents":42}'
    );
    const invalidJsonEntity: StartReplicationEntity = parser.parseReplication('{not-json');

    assert.equal(parsedEntity.version, 0);
    assert.equal(parsedEntity.module, 'START_SCREEN');
    assert.equal(parsedEntity.busy, false);
    assert.deepEqual(parsedEntity.conversations, []);
    assert.deepEqual(parsedEntity.documents, []);
    assert.equal(invalidJsonEntity.version, 0);
    assert.equal(invalidJsonEntity.module, 'START_SCREEN');
});
