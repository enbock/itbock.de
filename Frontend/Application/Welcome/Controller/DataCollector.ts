import GptStateUseCase from 'Core/Gpt/StateUseCase/StateUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';
import StateUseCase from 'Core/Welcome/StateUseCase/StateUseCase';
import DataCollection from 'Application/Welcome/Controller/DataCollection';

export default class DataCollector {
    constructor(
        private gptStateUseCase: GptStateUseCase,
        private startUseCase: StartUseCase,
        private audioStateUseCase: AudioStateUseCase,
        private stateUseCase: StateUseCase
    ) {
    }

    public getData(): DataCollection {
        const data: DataCollection = new DataCollection();

        this.gptStateUseCase.getState(data.gptState);
        this.startUseCase.getState(data.startState);
        this.audioStateUseCase.getState(data.audioState);
        this.stateUseCase.getState(data.welcomeState);

        return data;
    }
}
