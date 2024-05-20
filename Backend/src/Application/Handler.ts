import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import GenerateTokenController from './Mfa/GenerateTokenController';
import ValidateTokenController from './Mfa/ValidateTokenController';
import GptController from './Gpt/GptController';
import AudioTransformController from './Audio/AudioTransformController';

export default class Handler {

    constructor(
        private generateTokenController: GenerateTokenController,
        private validateTokenController: ValidateTokenController,
        private gptController: GptController,
        private audioTransformController: AudioTransformController
    ) {
    }

    public async generateTokenHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        return await this.generateTokenController.handle(event, context);
    }

    public async validateTokenHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        return await this.validateTokenController.handle(event, context);
    }

    public async generalGptHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        return await this.gptController.main(event, context);
    }

    public async audioTransformHandler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
        return await this.audioTransformController.handle(event);
    }
}
