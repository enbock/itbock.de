import ReplicationClient from 'Core/Start/ReplicationClient';
import FetchHelper from 'Infrastructure/ApiHelper/FetchHelper';
import Encoder from 'Infrastructure/Start/Replication/Client/Network/Encoder';
import Parser from 'Infrastructure/Start/Replication/Client/Network/Parser';
import StartReplicationEntity from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import Method from 'Infrastructure/ApiHelper/Method';

export default class Network implements ReplicationClient {
    constructor(
        private fetchHelper: FetchHelper,
        private encoder: Encoder,
        private parser: Parser
    ) {
    }

    public async loadState(sessionId: string, knownVersion: number): Promise<StartReplicationEntity | null> {
        try {
            const response: Response = await fetch(
                this.encoder.encodeLoadStateEndpoint(knownVersion),
                this.fetchHelper.createHeader(Method.GET, undefined, {'session-id': sessionId})
            );
            if (response.status == 204) return null;

            this.fetchHelper.assertSuccess(response);

            return this.parser.parseState(await response.json());
        } catch {
            return null;
        }
    }
}
