export default interface CommandHandler {
    support(command: string): boolean;

    run(): Promise<void>;
}
