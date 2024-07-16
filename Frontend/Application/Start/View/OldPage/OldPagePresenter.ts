import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';

export default class OldPagePresenter {
    public present(data: ResponseCollection): OldPageModel {
        const model: OldPageModel = new OldPageModel();

        model.i18n = data.i18n;

        return model;
    }
}
