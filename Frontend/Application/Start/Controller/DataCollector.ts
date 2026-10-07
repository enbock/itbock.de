import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import ConversationUseCase from 'Core/Gpt/ConversationUseCase/ConversationUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import LanguageUseCase from 'Core/I18n/UseCase/LanguageUseCase';
import ReplicationUseCase from 'Core/Start/ReplicationUseCase/ReplicationUseCase';
import {StartReplicationConversationEntity} from 'Core/Start/ReplicationUseCase/StartReplicationEntity';
import ConversationEntity from 'Core/Gpt/ConversationEntity';
import LeaderUseCase from 'Core/Replication/LeaderUseCase/LeaderUseCase';

export default class DataCollector {
    constructor(
        private audioStateUseCase: AudioStateUseCase,
        private conversationUseCase: ConversationUseCase,
        private startUseCase: StartUseCase,
        private languageService: LanguageUseCase,
        private replicationUseCase: ReplicationUseCase,
        private leaderUseCase: LeaderUseCase
    ) {
    }

    public async getData(): Promise<ResponseCollection> {
        const data: ResponseCollection = new ResponseCollection();

        this.conversationUseCase.getState(data.gptState);
        data.isLeader = this.leaderUseCase.isLeader();
        this.audioStateUseCase.getState(data.audioState, data.isLeader);
        this.startUseCase.getState(data.startState);
        data.replication = this.replicationUseCase.getState();
        data.startState.language = data.replication.language || data.startState.language;
        data.gptState.conversations = data.replication.conversations.map(this.mapConversation);
        data.i18n = await this.languageService.getI18n(data.startState);

        return data;
    }

    private mapConversation(conversation: StartReplicationConversationEntity): ConversationEntity {
        const entity: ConversationEntity = new ConversationEntity();
        entity.role = conversation.role;
        entity.text = conversation.text;
        entity.language = conversation.language;

        return entity;
    }
}
