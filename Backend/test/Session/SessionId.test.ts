import assert from 'node:assert/strict';
import test from 'node:test';
import InvalidSessionIdError from '../../src/Core/Start/InvalidSessionIdError';
import SessionId from '../../src/Core/Start/SessionId';

test('SessionId.normalize accepts UUID v4 values and normalizes casing', (): void => {
    const normalizedSessionId: string = SessionId.normalize('550E8400-E29B-41D4-A716-446655440000');

    assert.equal(normalizedSessionId, '550e8400-e29b-41d4-a716-446655440000');
});

test('SessionId.normalize rejects invalid session ids', (): void => {
    assert.throws(
        (): string => SessionId.normalize('550e8400-e29b-11d4-a716-446655440000'),
        InvalidSessionIdError
    );
    assert.throws(
        (): string => SessionId.normalize('not-a-session-id'),
        InvalidSessionIdError
    );
});
