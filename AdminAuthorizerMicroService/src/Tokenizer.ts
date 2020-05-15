export default interface Tokenizer {
    update(token:string, now: number): Promise<void>;
}
