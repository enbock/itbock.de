import test from 'node:test';
import assert from 'node:assert/strict';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import GptClient from 'Core/Gpt/GptClient';
import ConversationEntity from 'Core/Gpt/ConversationEntity';
import AudioService from 'Core/Audio/AudioService';
import AudioStorage, {AudioBuffer} from 'Core/Audio/AudioStorage';
import StartStorage from 'Core/Start/StartStorage';
import ReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';
import ReplicationCache from 'Core/Start/ReplicationCache';
import ReplicationClient from 'Core/Start/ReplicationClient';
import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import SessionService from 'Core/Replication/SessionService';
import SessionStorage from 'Core/Replication/SessionStorage';
import StateResponse from 'Core/Gpt/ConversationUseCase/Response/StateResponse';

class MemoryAudioStorage implements AudioStorage {
    private buffer: Array<AudioBuffer> = [];
    private playingText: AudioBuffer = {text: '', audio: ''};
    private playing: boolean = false;
    private microphoneMuted: boolean = false;
    private listening: boolean = false;

    public getBuffer(): Array<AudioBuffer> {
        return this.buffer;
    }

    public setBuffer(buffer: Array<AudioBuffer>): void {
        this.buffer = buffer;
    }

    public getPlayingText(): AudioBuffer {
        return this.playingText;
    }

    public setPlayingText(text: AudioBuffer): void {
        this.playingText = text;
    }

    public setPlaying(playing: boolean): void {
        this.playing = playing;
    }

    public getPlaying(): boolean {
        return this.playing;
    }

    public getMicrophoneMuted(): boolean {
        return this.microphoneMuted;
    }

    public setMicrophoneMuted(muted: boolean): void {
        this.microphoneMuted = muted;
    }

    public getListening(): boolean {
        return this.listening;
    }

    public setListening(isListening: boolean): void {
        this.listening = isListening;
    }
}

class MemoryStartStorage implements StartStorage {
    constructor(
        private language: string
    ) {
    }

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }
}

class FixedSessionStorage implements SessionStorage {
    constructor(
        private id: string
    ) {
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }
}

class FakeReplicationCache implements ReplicationCache {
    constructor(
        private state: StartReplicationEntity
    ) {
    }

    public getState(): StartReplicationEntity {
        return this.state;
    }

    public setState(startReplicationEntityPromise: StartReplicationEntity): void {
        this.state = startReplicationEntityPromise;
    }
}

class FakeReplicationClient implements ReplicationClient {
    public calls: Array<{sessionId: string; knownVersion: number}> = [];

    constructor(
        private nextState: StartReplicationEntity | null
    ) {
    }

    public async loadState(sessionId: string, knownVersion: number): Promise<StartReplicationEntity | null> {
        this.calls.push({sessionId, knownVersion});

        return this.nextState;
    }
}

class FakeGptClient implements GptClient {
    public calls: Array<Array<ConversationEntity>> = [];

    constructor(
        private response: ConversationEntity
    ) {
    }

    public async generalConversation(conversations: Array<ConversationEntity>): Promise<ConversationEntity> {
        this.calls.push(conversations);
        return this.response;
    }
}

class MemoryStateResponse implements StateResponse {
    public isLoading: boolean = false;
    public conversations: Array<ConversationEntity> = [];
}

function createReplicationUseCase(
    currentState: StartReplicationEntity,
    nextState: StartReplicationEntity | null
): {replicationUseCase: ReplicationUseCase; client: FakeReplicationClient} {
    const client: FakeReplicationClient = new FakeReplicationClient(nextState);
    return {
        replicationUseCase: new ReplicationUseCase(
            new FakeReplicationCache(currentState),
            client,
            new SessionService(() => 'unused', new FixedSessionStorage('session-1'))
        ),
        client
    };
}

test('ConversationUseCase sends only the new user message and refreshes replication afterwards', async () => {
    const currentReplicationState: StartReplicationEntity = new StartReplicationEntity();
    currentReplicationState.version = 1;
    currentReplicationState.language = 'en-US';
    const refreshedReplicationState: StartReplicationEntity = new StartReplicationEntity();
    refreshedReplicationState.version = 2;
    refreshedReplicationState.language = 'fr-FR';
    const {replicationUseCase, client} = createReplicationUseCase(
        currentReplicationState,
        refreshedReplicationState
    );
    const response: ConversationEntity = new ConversationEntity();
    response.role = 'assistant';
    response.text = 'Hello there';
    response.audio = 'audio-base64';
    response.language = 'fr-FR';
    const gptClient: FakeGptClient = new FakeGptClient(response);
    const audioStorage: MemoryAudioStorage = new MemoryAudioStorage();
    const audioService: AudioService = new AudioService(audioStorage);
    const startStorage: MemoryStartStorage = new MemoryStartStorage('de-DE');
    const useCase: ConversationUseCase = new ConversationUseCase(
        gptClient,
        audioService,
        startStorage,
        replicationUseCase
    );
    const loadingTransitions: Array<boolean> = [];

    await useCase.runConversation({
        conversation: 'Hi terminal',
        onStateChange: async () => {
            const state: MemoryStateResponse = new MemoryStateResponse();
            useCase.getState(state);
            loadingTransitions.push(state.isLoading);
        }
    });

    assert.equal(gptClient.calls.length, 1);
    assert.equal(gptClient.calls[0].length, 1);
    assert.equal(gptClient.calls[0][0].role, 'user');
    assert.equal(gptClient.calls[0][0].text, 'Hi terminal');
    assert.equal(gptClient.calls[0][0].language, 'en-US');
    assert.deepEqual(audioStorage.getBuffer(), [{text: 'Hello there', audio: 'audio-base64'}]);
    assert.equal(startStorage.getLanguage(), 'fr-FR');
    assert.equal(client.calls.length, 1);
    assert.deepEqual(client.calls[0], {sessionId: 'session-1', knownVersion: 1});
    assert.equal(replicationUseCase.getState().version, 2);
    assert.deepEqual(loadingTransitions, [true]);

    const finalState: MemoryStateResponse = new MemoryStateResponse();
    useCase.getState(finalState);
    assert.equal(finalState.isLoading, false);
});

test('ConversationUseCase uses the current language for start conversations', async () => {
    const currentReplicationState: StartReplicationEntity = new StartReplicationEntity();
    currentReplicationState.version = 5;
    currentReplicationState.language = 'it-IT';
    const {replicationUseCase, client} = createReplicationUseCase(currentReplicationState, null);
    const response: ConversationEntity = new ConversationEntity();
    response.role = 'assistant';
    response.text = 'Ciao';
    response.audio = 'audio-base64';
    response.language = 'it-IT';
    const gptClient: FakeGptClient = new FakeGptClient(response);
    const useCase: ConversationUseCase = new ConversationUseCase(
        gptClient,
        new AudioService(new MemoryAudioStorage()),
        new MemoryStartStorage('de-DE'),
        replicationUseCase
    );

    await useCase.startConversation({
        onStateChange: async () => undefined
    });

    assert.equal(gptClient.calls.length, 1);
    assert.equal(gptClient.calls[0][0].role, 'assistant');
    assert.equal(gptClient.calls[0][0].language, 'it-IT');
    assert.equal(client.calls.length, 1);
});
