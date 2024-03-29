import StartModel from 'Application/Start/View/StartModel';
import DataCollection from 'Application/Start/Controller/DataCollection';

export default class StartPresenter {
    public presentData(data: DataCollection): StartModel {
        const model: StartModel = new StartModel();

        model.showThinking = data.gptState.isLoading == true;
        model.showAudioSpooling = data.audioState.isLoading == true;
        model.showAudioText = data.audioState.isPlaying == true && data.audioState.isLoading == false;
        model.audioText = data.audioState.textOutput;

        return model;
    }
}
