export default interface Authorizer {
    login(password: string): Promise<boolean>;
}
