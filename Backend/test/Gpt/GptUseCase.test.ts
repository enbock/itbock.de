import assert from 'node:assert/strict';
import test from 'node:test';
import {ChatCompletionMessageParam} from 'openai/resources/chat/completions';
import AudioSyntheseClient from '../../src/Core/AudioSyntheseClient';
import ConversationMessage from '../../src/Core/Gpt/ConversationMessage';
import Command from '../../src/Core/Gpt/Command/Command';
import GptBackend from '../../src/Core/Gpt/GptBackend';
import GptEntity from '../../src/Core/Gpt/GptEntity';
import GptUseCase from '../../src/Core/Gpt/UseCase/GptUseCase';
import KnowledgeChunk from '../../src/Core/Rag/KnowledgeChunk';
import RetrievalUseCase from '../../src/Core/Rag/RetrievalUseCase';
import StartReplicationConversationEntryEntity from '../../src/Core/Start/StartReplicationConversationEntryEntity';
import StartReplicationDocumentEntity from '../../src/Core/Start/StartReplicationDocumentEntity';
import StartReplicationEntity from '../../src/Core/Start/StartReplicationEntity';
import StartReplicationFinishTurnResult from '../../src/Core/Start/StartReplicationFinishTurnResult';
import StartReplicationUseCase from '../../src/Core/Start/UseCase/StartReplicationUseCase';

class FakeGptBackend implements GptBackend {
    public nextResult: GptEntity = new GptEntity();
    public error: Error | null = null;
    public messages: Array<Array<ChatCompletionMessageParam>> = [];

    public async runChatCompletion(messages: Array<ChatCompletionMessageParam>): Promise<GptEntity> {
        this.messages.push(messages);

        if (this.error !== null) {
            throw this.error;
        }

        return this.nextResult;
    }

    public async translate(_language: string, _data: Json): Promise<Json> {
        return {};
    }
}

class FakeAudioSyntheseClient implements AudioSyntheseClient {
    public result: string = 'audio-base64';
    public calls: Array<string> = [];

    public async speech(text: string): Promise<string> {
        this.calls.push(text);
        return this.result;
    }
}

class FakeCommand implements Command {
    public calls: Array<string> = [];

    public supports(result: GptEntity): boolean {
        return result.internalCommands.includes('decorate');
    }

    public async execute(result: GptEntity): Promise<void> {
        this.calls.push(result.say);
        result.say = `${result.say} [decorated]`;
    }
}

class FakeRetrievalUseCase {
    public retrievedChunks: Array<{chunk: KnowledgeChunk; score: number}> = [];
    public chunksById: Map<string, KnowledgeChunk> = new Map();
    public chunksByDocumentId: Map<string, Array<KnowledgeChunk>> = new Map();
    public retrieveCalls: Array<string> = [];
    public findChunksCalls: Array<Array<string>> = [];
    public findChunksByDocumentIdCalls: Array<string> = [];

    public async retrieve(query: string): Promise<Array<{chunk: KnowledgeChunk; score: number}>> {
        this.retrieveCalls.push(query);
        return this.retrievedChunks;
    }

    public async findChunks(ids: Array<string>): Promise<Array<KnowledgeChunk>> {
        this.findChunksCalls.push(ids);

        return ids.flatMap((id: string): Array<KnowledgeChunk> => {
            const chunk: KnowledgeChunk | undefined = this.chunksById.get(id);
            return chunk === undefined ? [] : [chunk];
        });
    }

    public async findChunksByDocumentId(documentId: string): Promise<Array<KnowledgeChunk>> {
        this.findChunksByDocumentIdCalls.push(documentId);
        return this.chunksByDocumentId.get(documentId) || [];
    }

    public getPageCatalog(): Array<{module: string; description: string}> {
        return [
            {module: 'START_SCREEN', description: 'Start'},
            {module: 'CONVERSATION', description: 'Conversation'},
            {module: 'OLD_PAGE', description: 'Old page'},
            {module: 'INFO', description: 'Info'}
        ];
    }
}

class FakeStartReplicationUseCase {
    public session: StartReplicationEntity = new StartReplicationEntity();
    public startTurnCalls: Array<{
        sessionId: string;
        userMessage?: StartReplicationConversationEntryEntity;
    }> = [];
    public finishTurnCalls: Array<{
        sessionId: string;
        result: StartReplicationFinishTurnResult;
    }> = [];

    public async startTurn(
        sessionId: string,
        userMessage?: StartReplicationConversationEntryEntity
    ): Promise<StartReplicationEntity> {
        this.startTurnCalls.push({sessionId, userMessage});

        const nextSession: StartReplicationEntity = cloneSession(this.session);
        nextSession.version += 1;
        nextSession.persisted = true;
        nextSession.busy = true;
        nextSession.busySince = new Date('2026-10-07T00:00:00.000Z');

        if (userMessage !== undefined) {
            nextSession.appendConversation(userMessage);
        }

        this.session = cloneSession(nextSession);

        return cloneSession(nextSession);
    }

    public async finishTurn(
        sessionId: string,
        result: StartReplicationFinishTurnResult
    ): Promise<StartReplicationEntity> {
        this.finishTurnCalls.push({sessionId, result});

        const nextSession: StartReplicationEntity = cloneSession(this.session);
        nextSession.version += 1;
        nextSession.persisted = true;

        if (result.resetSession) {
            nextSession.reset(result.language);
        } else {
            if (result.assistantText) {
                nextSession.appendConversation(
                    new StartReplicationConversationEntryEntity(
                        'assistant',
                        result.assistantText,
                        result.language
                    )
                );
            }

            nextSession.language = result.language;
            nextSession.module = result.module;
            nextSession.setDocuments(result.documents);
            nextSession.clearBusy();
        }

        this.session = cloneSession(nextSession);

        return cloneSession(nextSession);
    }
}

function createChunk(
    id: string,
    documentId: string,
    module: KnowledgeChunk['module'],
    text: string
): KnowledgeChunk {
    return {
        id,
        documentId,
        title: id,
        module,
        text,
        url: null,
        embedding: [1, 0]
    };
}

function cloneSession(source: StartReplicationEntity): StartReplicationEntity {
    const clone: StartReplicationEntity = new StartReplicationEntity();

    clone.persisted = source.persisted;
    clone.version = source.version;
    clone.updatedAt = source.updatedAt === null ? null : new Date(source.updatedAt);
    clone.module = source.module;
    clone.language = source.language;
    clone.busy = source.busy;
    clone.busySince = source.busySince === null ? null : new Date(source.busySince);
    clone.conversations = source.conversations.map(
        (entry: StartReplicationConversationEntryEntity): StartReplicationConversationEntryEntity => {
            return new StartReplicationConversationEntryEntity(entry.role, entry.text, entry.language);
        }
    );
    clone.documents = source.documents.map(
        (document: StartReplicationDocumentEntity): StartReplicationDocumentEntity => {
            return new StartReplicationDocumentEntity(
                document.id,
                document.title,
                document.text,
                document.url
            );
        }
    );

    return clone;
}

function createUseCase(
    backend: FakeGptBackend,
    audioSyntheseClient: FakeAudioSyntheseClient,
    commands: Array<Command>,
    retrievalUseCase?: FakeRetrievalUseCase,
    startReplicationUseCase?: FakeStartReplicationUseCase
): GptUseCase {
    return new GptUseCase(
        backend,
        audioSyntheseClient,
        commands,
        retrievalUseCase as unknown as RetrievalUseCase,
        startReplicationUseCase as unknown as StartReplicationUseCase
    );
}

test('GptUseCase stores a session turn, retrieves knowledge and finishes the session', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const command: FakeCommand = new FakeCommand();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();
    const aboutChunk: KnowledgeChunk = createChunk('about-endre#0', 'about-endre', 'INFO', 'Über Endre');

    startReplicationUseCase.session.version = 1;
    startReplicationUseCase.session.module = 'CONVERSATION';
    startReplicationUseCase.session.appendConversation(
        new StartReplicationConversationEntryEntity('assistant', 'Vorherige Antwort', 'de-DE')
    );
    retrievalUseCase.retrievedChunks = [{chunk: aboutChunk, score: 0.91}];
    retrievalUseCase.chunksById.set(aboutChunk.id, aboutChunk);

    backend.nextResult.say = 'Endre ist Fullstackentwickler.';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';
    backend.nextResult.internalCommands = ['decorate'];
    backend.nextResult.page = {
        module: 'INFO',
        documentIds: [aboutChunk.id]
    };

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [command],
        retrievalUseCase,
        startReplicationUseCase
    );

    const result: GptEntity = await useCase.execute(
        [
            ConversationMessage.create('user', 'Erzählen Sie mir von Endre.', 'de-DE')
        ],
        '550e8400-e29b-41d4-a716-446655440000'
    );

    assert.equal(startReplicationUseCase.startTurnCalls.length, 1);
    assert.equal(startReplicationUseCase.startTurnCalls[0].userMessage?.text, 'Erzählen Sie mir von Endre.');
    assert.deepStrictEqual(retrievalUseCase.retrieveCalls, ['Erzählen Sie mir von Endre.\n\nVorherige Antwort']);
    assert.equal(backend.messages.length, 1);
    assert.match(String(backend.messages[0][3].content), /Seitenkatalog/);
    assert.equal(backend.messages[0].at(-1)?.role, 'user');
    assert.equal(startReplicationUseCase.finishTurnCalls.length, 1);
    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.module, 'INFO');
    assert.deepStrictEqual(
        startReplicationUseCase.finishTurnCalls[0].result.documents.map(
            (document: StartReplicationDocumentEntity): string => document.id
        ),
        ['about-endre#0']
    );
    assert.equal(command.calls.length, 1);
    assert.deepStrictEqual(audioSyntheseClient.calls, ['Endre ist Fullstackentwickler. [decorated]']);
    assert.equal(result.audio, 'audio-base64');
    assert.equal(result.module, 'INFO');
    assert.equal(result.version, 3);
});

test('GptUseCase rejects invalid page decisions and keeps the current session module', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();

    startReplicationUseCase.session.module = 'CONVERSATION';
    backend.nextResult.say = 'Antwort';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';
    backend.nextResult.page = {
        module: 'INFO',
        documentIds: ['missing#0']
    };

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [],
        retrievalUseCase,
        startReplicationUseCase
    );

    const result: GptEntity = await useCase.execute(
        [
            ConversationMessage.create('user', 'Zeigen Sie mir Infos.', 'de-DE')
        ],
        '550e8400-e29b-41d4-a716-446655440000'
    );

    assert.deepStrictEqual(retrievalUseCase.findChunksCalls, [['missing#0']]);
    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.module, 'CONVERSATION');
    assert.deepStrictEqual(startReplicationUseCase.finishTurnCalls[0].result.documents, []);
    assert.equal(result.module, 'CONVERSATION');
});

test('GptUseCase rejects modules that are not part of the page catalog', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();

    startReplicationUseCase.session.module = 'CONVERSATION';
    backend.nextResult.say = 'Antwort';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';
    backend.nextResult.page = {
        module: 'UNKNOWN',
        documentIds: []
    };

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [],
        retrievalUseCase,
        startReplicationUseCase
    );

    const result: GptEntity = await useCase.execute(
        [
            ConversationMessage.create('user', 'Zeigen Sie mir Infos.', 'de-DE')
        ],
        '550e8400-e29b-41d4-a716-446655440000'
    );

    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.module, 'CONVERSATION');
    assert.deepStrictEqual(startReplicationUseCase.finishTurnCalls[0].result.documents, []);
    assert.equal(result.module, 'CONVERSATION');
});

test('GptUseCase resets the session for shutdown commands', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();

    startReplicationUseCase.session.module = 'CONVERSATION';
    startReplicationUseCase.session.appendConversation(
        new StartReplicationConversationEntryEntity('assistant', 'Vorher', 'de-DE')
    );
    backend.nextResult.say = 'Auf Wiedersehen.';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';
    backend.nextResult.commands = ['shutdown'];

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [],
        retrievalUseCase,
        startReplicationUseCase
    );

    const result: GptEntity = await useCase.execute(
        [
            ConversationMessage.create('user', 'Terminal ausschalten', 'de-DE')
        ],
        '550e8400-e29b-41d4-a716-446655440000'
    );

    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.resetSession, true);
    assert.equal(result.module, 'START_SCREEN');
    assert.equal(startReplicationUseCase.session.conversations.length, 0);
});

test('GptUseCase maps openOldPage to OLD_PAGE documents', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();
    const oldChunks: Array<KnowledgeChunk> = [
        createChunk('old-homepage#0', 'old-homepage', 'OLD_PAGE', 'Überblick'),
        createChunk('old-homepage#1', 'old-homepage', 'OLD_PAGE', 'Nutzung')
    ];

    retrievalUseCase.chunksByDocumentId.set('old-homepage', oldChunks);
    backend.nextResult.say = 'Hier ist die Homepage von 2020.';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';
    backend.nextResult.commands = ['openOldPage'];

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [],
        retrievalUseCase,
        startReplicationUseCase
    );

    const result: GptEntity = await useCase.execute(
        [
            ConversationMessage.create('user', 'Öffnen Sie die alte Homepage.', 'de-DE')
        ],
        '550e8400-e29b-41d4-a716-446655440000'
    );

    assert.deepStrictEqual(retrievalUseCase.findChunksByDocumentIdCalls, ['old-homepage']);
    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.module, 'OLD_PAGE');
    assert.deepStrictEqual(
        startReplicationUseCase.finishTurnCalls[0].result.documents.map(
            (document: StartReplicationDocumentEntity): string => document.id
        ),
        ['old-homepage#0', 'old-homepage#1']
    );
    assert.equal(result.module, 'OLD_PAGE');
});

test('GptUseCase moves greeting calls from START_SCREEN to CONVERSATION', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();

    startReplicationUseCase.session.module = 'START_SCREEN';
    backend.nextResult.say = 'Das Terminal ist bereit.';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [],
        retrievalUseCase,
        startReplicationUseCase
    );

    const result: GptEntity = await useCase.execute(
        [
            ConversationMessage.create('assistant', 'Start', 'de-DE')
        ],
        '550e8400-e29b-41d4-a716-446655440000'
    );

    assert.equal(startReplicationUseCase.startTurnCalls[0].userMessage, undefined);
    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.module, 'CONVERSATION');
    assert.equal(result.module, 'CONVERSATION');
});

test('GptUseCase clears busy sessions again when GPT fails after startTurn', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();
    const retrievalUseCase: FakeRetrievalUseCase = new FakeRetrievalUseCase();
    const startReplicationUseCase: FakeStartReplicationUseCase = new FakeStartReplicationUseCase();

    startReplicationUseCase.session.module = 'CONVERSATION';
    backend.error = new Error('GPT failed');

    const useCase: GptUseCase = createUseCase(
        backend,
        audioSyntheseClient,
        [],
        retrievalUseCase,
        startReplicationUseCase
    );

    await assert.rejects(
        async (): Promise<void> => {
            await useCase.execute(
                [
                    ConversationMessage.create('user', 'Frage', 'de-DE')
                ],
                '550e8400-e29b-41d4-a716-446655440000'
            );
        },
        /GPT failed/
    );

    assert.equal(startReplicationUseCase.startTurnCalls.length, 1);
    assert.equal(startReplicationUseCase.finishTurnCalls.length, 1);
    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.assistantText, '');
    assert.equal(startReplicationUseCase.finishTurnCalls[0].result.module, 'CONVERSATION');
    assert.equal(startReplicationUseCase.session.busy, false);
});

test('GptUseCase keeps the stateless path unchanged without a session id', async (): Promise<void> => {
    const backend: FakeGptBackend = new FakeGptBackend();
    const audioSyntheseClient: FakeAudioSyntheseClient = new FakeAudioSyntheseClient();

    backend.nextResult.say = 'Hallo.';
    backend.nextResult.role = 'assistant';
    backend.nextResult.language = 'de-DE';

    const useCase: GptUseCase = createUseCase(backend, audioSyntheseClient, []);
    const pastConversation: Array<ChatCompletionMessageParam> = [
        ConversationMessage.create('user', 'Hallo', 'de-DE')
    ];

    const result: GptEntity = await useCase.execute(pastConversation);

    assert.equal(backend.messages.length, 1);
    assert.equal(backend.messages[0].length, 4);
    assert.equal(backend.messages[0].at(-1)?.role, 'user');
    assert.deepStrictEqual(audioSyntheseClient.calls, ['Hallo.']);
    assert.equal(result.version, 0);
    assert.equal(result.module, 'CONVERSATION');
});
