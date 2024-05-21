import AudioTransformUseCase from '../../Core/Audio/AudioTransformUseCase';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export default class AudioTransformController {
    constructor(
        private audioTransformUseCase: AudioTransformUseCase
    ) {
    }

    public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: 'Request body is missing'})
                };
            }

            const requestBody = JSON.parse(event.body);
            const audioBase64 = requestBody.audio;
            if (!audioBase64) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: 'Audio data is missing'})
                };
            }

            const fileBuffer = Buffer.from(audioBase64, 'base64');

            try {
                const transcript: string = await this.audioTransformUseCase.execute(fileBuffer);
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({transcript})
                };
            } catch (error) {
                console.error('Error processing audio file:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({message: 'Unexpected error: ' + error})
                };
            }
        } catch (error) {
            console.error('Error processing request:', error);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: 'Unexpected error: ' + error})
            };
        }
    }
}
