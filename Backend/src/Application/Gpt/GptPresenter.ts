import GptEntity from '../../Core/Gpt/GptEntity';

export default class GptPresenter {
    public presentBod(gpt: GptEntity): string {
        return JSON.stringify({
            commands: gpt.commands || '',
            say: gpt.say,
            role: gpt.role,
            language: gpt.language,
            audio: gpt.audio
        });
    }
}
