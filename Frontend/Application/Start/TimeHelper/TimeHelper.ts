export class TimeHandler {
    private id: number = 0;

    constructor(
        private action: Callback,
        private timeout: number
    ) {
    }

    public start(): void {
        if (this.id) this.stop();
        this.id = setTimeout(this.callAction.bind(this), this.timeout) as any;
    }

    public stop(): void {
        clearTimeout(this.id);
        this.id = 0;
    }

    private callAction(): void {
        this.id = 0;
        void this.action();
    }
}

export default class TimeHelper {
    public register(action: Callback, timeout: number): TimeHandler {
        return new TimeHandler(action, timeout);
    }
}
