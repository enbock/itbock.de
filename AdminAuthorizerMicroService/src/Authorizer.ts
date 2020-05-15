export default interface Authorizer {
    authorize(token:string, now:number): Promise<boolean>;
}
