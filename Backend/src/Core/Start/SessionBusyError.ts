export default class SessionBusyError extends Error {
    constructor(message: string = 'Session is busy') {
        super(message);
        this.name = 'SessionBusyError';
    }
}
