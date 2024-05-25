import StartScreenModel from 'Application/Start/View/StartScreen/StartScreenModel';
import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';

export default class StartScreenPresenter {
    public present(data: ResponseCollection): StartScreenModel {
        const model: StartScreenModel = new StartScreenModel();
        model.i18n.startLabel = data.i18n.startScreen.startLabel;
        return model;
    }
}
