import AudioTransformClient from 'Core/Audio/InputUseCase/AudioTransformClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import Method from 'Infrastructure/ApiHelper/Method';

export default class Network implements AudioTransformClient {
    constructor(
        private fetchHelper: FetchHelper,
        private serviceUrl: string
    ) {
    }

    public async transcribeAudio(audioBlob: Blob): Promise<string> {
        const base64Audio: string = await this.blobToBase64(audioBlob);
        const jsonBody: string = JSON.stringify({ audio: base64Audio });

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

    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1]; // Remove the data type prefix
                resolve(base64String);
            };
            reader.onerror = () => {
                reject(new Error('Failed to convert blob to base64'));
            };
            reader.readAsDataURL(blob);
        });
    }
}