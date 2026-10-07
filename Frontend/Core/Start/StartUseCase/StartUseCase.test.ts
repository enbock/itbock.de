import test from 'node:test';
import assert from 'node:assert/strict';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import StartStorage from 'Core/Start/StartStorage';
import AudioFeedbackClient, {AudioFeedback} from 'Core/Audio/AudioFeedbackClient';
import Response from 'Core/Start/StartUseCase/Response';

class MemoryStartStorage implements StartStorage {
    private language: string = '';

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }
}

class FakeAudioFeedbackClient implements AudioFeedbackClient {
    public played: Array<AudioFeedback> = [];

    public async play(feedback: AudioFeedback): Promise<void> {
        this.played.push(feedback);
    }
}

test('StartUseCase marks the session as started after the start button is pressed', async () => {
    const feedback: FakeAudioFeedbackClient = new FakeAudioFeedbackClient();
    const useCase: StartUseCase = new StartUseCase(new MemoryStartStorage(), feedback);
    const response: Response = {language: '', sessionStarted: false};

    useCase.initialize('de');
    useCase.getState(response);

    assert.equal(response.language, 'de');
    assert.equal(response.sessionStarted, false);

    useCase.startSession();
    useCase.getState(response);

    assert.equal(response.sessionStarted, true);
    assert.deepEqual(feedback.played, []);

    await useCase.startApplication();
    assert.deepEqual(feedback.played, [AudioFeedback.SCREEN_ON]);
});

test('StartUseCase ends the session and plays the screen-off sound', async () => {
    const feedback: FakeAudioFeedbackClient = new FakeAudioFeedbackClient();
    const useCase: StartUseCase = new StartUseCase(new MemoryStartStorage(), feedback);
    const response: Response = {language: '', sessionStarted: false};

    useCase.startSession();
    useCase.getState(response);

    assert.equal(response.sessionStarted, true);

    await useCase.endSession();
    useCase.getState(response);

    assert.equal(response.sessionStarted, false);
    assert.deepEqual(feedback.played, [AudioFeedback.SCREEN_OFF]);
});
