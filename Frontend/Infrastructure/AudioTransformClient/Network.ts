import AudioTransformClient from 'Core/Audio/InputUseCase/AudioTransformClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import Method from 'Infrastructure/ApiHelper/Method';

export default class Network implements AudioTransformClient {
    constructor(
        private fetchHelper: FetchHelper,
        private serviceUrl: string
    ) {
    }

    public async transcribeAudio(audioBase64: string): Promise<string> {
        const jsonBody: string = JSON.stringify({ audio: audioBase64 });

        const response: Response = await fetch(
            this.serviceUrl,
            this.fetchHelper.createHeader(Method.POST, jsonBody)
        );

        if (!this.fetchHelper.isResponseSuccessful(response)) {
            throw new Error('Transcription failed');
        }

        const data: Json = await response.json();
        return String(data.transcript || '');
    }
}
