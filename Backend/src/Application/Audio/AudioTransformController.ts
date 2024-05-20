import AudioTransformUseCase from '../../Core/Audio/AudioTransformUseCase';
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import Busboy from 'busboy';

export default class AudioTransformController {
    constructor(
        private audioTransformUseCase: AudioTransformUseCase
    ) {
    }

    public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            const contentType = event.headers['content-type'] || event.headers['Content-Type'];
            if (!contentType?.startsWith('multipart/form-data')) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({message: 'Content-Type header is missing or invalid'})
                };
            }

            const busboy = Busboy({headers: {'content-type': contentType}});
            let fileBuffer: Buffer | null = null;

            return new Promise<APIGatewayProxyResult>((resolve, reject) => {
                busboy.on('file', (fieldname, file) => {
                    const chunks: Buffer[] = [];
                    file.on('data', chunk => {
                        chunks.push(chunk);
                    });
                    file.on('end', () => {
                        fileBuffer = Buffer.concat(chunks);
                    });
                });

                busboy.on('finish', async () => {
                    if (!fileBuffer) {
                        resolve({
                            statusCode: 400,
                            body: JSON.stringify({message: 'File upload failed'})
                        });
                        return;
                    }

                    try {
                        const transcript: string = await this.audioTransformUseCase.execute(fileBuffer);
                        resolve({
                            statusCode: 200,
                            body: JSON.stringify({transcript})
                        });
                    } catch (error) {
                        console.error('Error processing audio file:', error);
                        resolve({
                            statusCode: 500,
                            body: JSON.stringify({message: 'Unexpected error: ' + error})
                        });
                    }
                });

                busboy.write(event.body || '', event.isBase64Encoded ? 'base64' : 'binary');
                busboy.end();
            });
        } catch (error) {
            console.error('Error processing audio file:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Unexpected error: ' + error})
            };
        }
    }
}
