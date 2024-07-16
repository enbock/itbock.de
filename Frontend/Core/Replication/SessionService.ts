import {v4} from 'uuid';
import SessionStorage from 'Core/Replication/SessionStorage';

export default class SessionService {
    constructor(
        private uuid: typeof v4,
        private sessionStorage: SessionStorage
    ) {
    }

    public getSessionId(): string {
        let id: string = this.sessionStorage.getId();
        if (id == '') id = this.createNewSession();

        return id;
    }

    private createNewSession(): string {
        const id: string = this.uuid();
        this.sessionStorage.setId(id);

        return id;
    }
}
