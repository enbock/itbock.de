import DataCollection from 'Application/Start/Controller/DataCollection';
import GptStateUseCase from 'Core/Gpt/StateUseCase/StateUseCase';
import StartUseCase from 'Core/Start/StartUseCase/StartUseCase';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';

export default class DataCollector {
    constructor(
        private gptStateUseCase: GptStateUseCase,
        private startUseCase: StartUseCase,
        private audioStateUseCase: AudioStateUseCase
    ) {
    }

    public getData(): DataCollection {
        const data: DataCollection = new DataCollection();

        this.gptStateUseCase.getState(data.gptState);
        this.startUseCase.getState(data.startState);
        this.audioStateUseCase.getState(data.audioState);

        return data;
    }
}
