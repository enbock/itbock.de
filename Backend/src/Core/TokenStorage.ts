export default interface TokenStorage {
    getToken(userId: string): Promise<string | undefined>;

    setToken(userId: string, token: string): Promise<void>;

    deleteToken(userId: string): Promise<void>;
}
