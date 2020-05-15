export default interface Tokenizer {
    generate(now: number): Promise<string>;
}
