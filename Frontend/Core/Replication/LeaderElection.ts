export type LeaderElectionChangeCallback = (isLeader: boolean) => void;

export default interface LeaderElection {
    start(): Promise<void>;

    isLeader(): boolean;

    onChange(callback: LeaderElectionChangeCallback): void;
}
