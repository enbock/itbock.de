import StartModel from 'Application/Start/View/StartModel';
import DataCollection from 'Application/Start/Controller/DataCollection';

export default class StartPresenter {
    public presentData(data: DataCollection): StartModel {
        const model: StartModel = new StartModel();

        model.showStart = data.startState.applicationStarted == false && data.gptState.isLoading == false;
        model.showThinking = data.gptState.isLoading == true;
        model.showApplication = data.startState.applicationStarted == true;
        model.showAudioSpooling = data.audioState.isLoading == true;

        return model;
    }
}
