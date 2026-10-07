import LeaderElection, {LeaderElectionChangeCallback} from 'Core/Replication/LeaderElection';

const MICROPHONE_LOCK_NAME: string = 'itbock.microphone';

export default class WebLocks implements LeaderElection {
    private callbacks: Array<LeaderElectionChangeCallback> = [];
    private leader: boolean = false;
    private started: boolean = false;
    private waitingForLeadership: boolean = false;

    constructor(
        private lockManager?: LockManager
    ) {
    }

    public async start(): Promise<void> {
        if (this.started) return;
        this.started = true;

        if (!this.lockManager) {
            this.changeLeader(true);
            return;
        }

        await new Promise<void>((resolve) => {
            void this.lockManager?.request(
                MICROPHONE_LOCK_NAME,
                {
                    mode: 'exclusive',
                    ifAvailable: true
                },
                async (lock: Lock | null): Promise<void> => {
                    if (lock) {
                        this.changeLeader(true);
                        resolve();
                        await new Promise<void>(() => undefined);
                        return;
                    }

                    this.waitForLeadership();
                    resolve();
                }
            );
        });
    }

    public isLeader(): boolean {
        return this.leader;
    }

    public onChange(callback: LeaderElectionChangeCallback): void {
        this.callbacks.push(callback);
    }

    private waitForLeadership(): void {
        if (!this.lockManager || this.waitingForLeadership) return;

        this.waitingForLeadership = true;
        void this.lockManager.request(
            MICROPHONE_LOCK_NAME,
            {
                mode: 'exclusive'
            },
            async (): Promise<void> => {
                this.waitingForLeadership = false;
                this.changeLeader(true);
                await new Promise<void>(() => undefined);
            }
        );
    }

    private changeLeader(isLeader: boolean): void {
        if (this.leader == isLeader) return;

        this.leader = isLeader;
        this.callbacks.forEach((callback: LeaderElectionChangeCallback) => callback(isLeader));
    }
}
