import DataCollection from 'Application/Start/Controller/DataCollection';
import GptStateUseCase from 'Core/Gpt/StateUseCase/StateUseCase';
import AudioStateUseCase from 'Core/Audio/StateUseCase/StateUseCase';

export default class DataCollector {
    constructor(
        private gptStateUseCase: GptStateUseCase,
        private audioStateUseCase: AudioStateUseCase
    ) {
    }

    public getData(): DataCollection {
        const data: DataCollection = new DataCollection();

        this.gptStateUseCase.getState(data.gptState);
        this.audioStateUseCase.getState(data.audioState);

        return data;
    }
}
