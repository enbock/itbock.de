import StartModel from 'Application/Start/View/StartModel';
import StateResponse from 'Application/Start/Controller/StateResponse';

export default class StartPresenter {

    public presentData(state: StateResponse): StartModel {
        const model: StartModel = new StartModel();

        model.showStart = state.applicationStarted == false;

        return model;
    }
}
