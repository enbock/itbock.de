export default class ReplicationConflictError extends Error {
    constructor(message: string = 'Replication session write conflict') {
        super(message);
        this.name = 'ReplicationConflictError';
    }
}
