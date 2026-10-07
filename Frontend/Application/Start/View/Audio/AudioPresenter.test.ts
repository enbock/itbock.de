import test from 'node:test';
import assert from 'node:assert/strict';
import AudioPresenter from 'Application/Start/View/Audio/AudioPresenter';
import AudioOutputDevice from 'Application/Start/View/Audio/AudioOutputDevice';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import {AudioBuffer} from 'Core/Audio/AudioStorage';

class FakeAudioOutputDevice {
    public calls: Array<AudioBuffer> = [];

    public async playAudio(buffer: AudioBuffer): Promise<void> {
        this.calls.push(buffer);
    }
}

test('AudioPresenter keeps followers silent and disables their microphone state', () => {
    const audioOutputDevice: FakeAudioOutputDevice = new FakeAudioOutputDevice();
    const presenter: AudioPresenter = new AudioPresenter(audioOutputDevice as unknown as AudioOutputDevice);
    const data: ResponseCollection = new ResponseCollection();

    data.isLeader = false;
    data.audioState.audioInputEnabled = true;
    data.audioState.microphoneEnable = true;
    data.audioState.audioOutput = {
        text: 'Hallo',
        audio: 'audio-base64'
    };

    const model = presenter.present(data);

    assert.equal(model.doListening, false);
    assert.equal(model.microphoneEnabled, false);
    assert.deepEqual(audioOutputDevice.calls, []);
});
