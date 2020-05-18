export default interface GridStorage {
    save(name: string, data: any): Promise<void>;
}
