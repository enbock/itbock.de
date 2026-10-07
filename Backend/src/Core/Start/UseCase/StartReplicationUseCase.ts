import ReplicationConflictError from '../ReplicationConflictError';
import SessionBusyError from '../SessionBusyError';
import StartReplicationEntity from '../StartReplicationEntity';
import StartReplicationConversationEntryEntity from '../StartReplicationConversationEntryEntity';
import StartReplicationFinishTurnResult from '../StartReplicationFinishTurnResult';
import SessionId from '../SessionId';
import ReplicationStorage from '../ReplicationStorage';

export default class StartReplicationUseCase {
    private static readonly busyTimeoutInMilliseconds: number = 60_000;
    private static readonly maxUpdateRetries: number = 5;

    constructor(
        private startReplicationClient: ReplicationStorage
    ) {
    }

    public async loadSessionData(sessionId: string): Promise<StartReplicationEntity> {
        const normalizedSessionId: string = SessionId.normalize(sessionId);
        const sessionData: StartReplicationEntity =
            (await this.startReplicationClient.loadSessionData(normalizedSessionId)).session;

        this.normalizeBusyState(sessionData);

        return sessionData;
    }

    public async updateSession(
        sessionId: string,
        change: (session: StartReplicationEntity) => void | Promise<void>
    ): Promise<StartReplicationEntity> {
        const normalizedSessionId: string = SessionId.normalize(sessionId);
        let lastConflict: ReplicationConflictError | null = null;

        for (
            let currentAttempt: number = 0;
            currentAttempt < StartReplicationUseCase.maxUpdateRetries;
            currentAttempt++
        ) {
            const loadResult = await this.startReplicationClient.loadSessionData(normalizedSessionId);
            const sessionData: StartReplicationEntity = loadResult.session;

            this.normalizeBusyState(sessionData);
            await change(sessionData);

            sessionData.version += 1;
            sessionData.updatedAt = new Date();
            sessionData.persisted = true;

            try {
                await this.startReplicationClient.saveSessionData(
                    normalizedSessionId,
                    sessionData,
                    loadResult.revisionToken
                );

                return sessionData;
            } catch (error) {
                if (!(error instanceof ReplicationConflictError)) {
                    throw error;
                }

                lastConflict = error;
            }
        }

        if (lastConflict !== null) {
            throw lastConflict;
        }

        throw new ReplicationConflictError();
    }

    public async startTurn(
        sessionId: string,
        userMessage?: StartReplicationConversationEntryEntity
    ): Promise<StartReplicationEntity> {
        return await this.updateSession(
            sessionId,
            (sessionData: StartReplicationEntity): void => {
                this.beginBusy(sessionData);

                if (userMessage !== undefined) {
                    sessionData.appendConversation(userMessage);
                }
            }
        );
    }

    public async finishTurn(
        sessionId: string,
        result: StartReplicationFinishTurnResult
    ): Promise<StartReplicationEntity> {
        return await this.updateSession(
            sessionId,
            (sessionData: StartReplicationEntity): void => {
                if (result.resetSession) {
                    sessionData.reset(result.language);
                    return;
                }

                if (result.assistantText) {
                    sessionData.appendConversation(
                        new StartReplicationConversationEntryEntity(
                            'assistant',
                            result.assistantText,
                            result.language
                        )
                    );
                }

                sessionData.language = result.language;
                sessionData.module = result.module;
                sessionData.setDocuments(result.documents);
                sessionData.clearBusy();
            }
        );
    }

    public beginBusy(sessionData: StartReplicationEntity, now: Date = new Date()): void {
        if (this.isBusy(sessionData, now)) {
            throw new SessionBusyError();
        }

        sessionData.busy = true;
        sessionData.busySince = now;
    }

    public isBusy(sessionData: StartReplicationEntity, now: Date = new Date()): boolean {
        if (!sessionData.busy || sessionData.busySince === null) {
            return false;
        }

        return now.getTime() - sessionData.busySince.getTime() <= StartReplicationUseCase.busyTimeoutInMilliseconds;
    }

    private normalizeBusyState(sessionData: StartReplicationEntity, now: Date = new Date()): void {
        if (this.isBusy(sessionData, now)) {
            return;
        }

        sessionData.clearBusy();
    }
}
