import WelcomeModel from 'Application/Welcome/View/WelcomeModel';
import DataCollection from 'Application/Welcome/Controller/DataCollection';

export default class WelcomePresenter {
    public present(data: DataCollection): WelcomeModel {
        const model: WelcomeModel = new WelcomeModel();
        
        model.showOldHomepages = data.welcomeState.linksShown;
        model.showStart = data.startState.applicationStarted == false && data.gptState.isLoading == false;

        return model;
    }
}
