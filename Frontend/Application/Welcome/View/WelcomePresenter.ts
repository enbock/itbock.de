import StateResponse from 'Application/Welcome/Controller/StateResponse';
import WelcomeModel from 'Application/Welcome/View/WelcomeModel';

export default class WelcomePresenter {
    public present(data: StateResponse): WelcomeModel {
        const model: WelcomeModel = new WelcomeModel();
        model.showOldHomepages = data.linksShown;
        return model;
    }
}
