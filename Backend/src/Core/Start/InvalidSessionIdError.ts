export default class InvalidSessionIdError extends Error {
    constructor(message: string = 'Session ID is invalid') {
        super(message);
        this.name = 'InvalidSessionIdError';
    }
}
