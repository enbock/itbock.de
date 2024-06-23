import GptEntity from '../GptEntity';

export default interface Command {
    supports(result: GptEntity): boolean;

    execute(result: GptEntity): Promise<void>;
}
