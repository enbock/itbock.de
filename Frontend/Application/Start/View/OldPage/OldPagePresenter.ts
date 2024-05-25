import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';

export default class OldPagePresenter {
    public present(data: ResponseCollection): OldPageModel {
        const model: OldPageModel = new OldPageModel();

        model.i18n.linkLabel = data.i18n.oldPage.linkLabel;
        model.i18n.title = data.i18n.oldPage.title;

        return model;
    }
}
