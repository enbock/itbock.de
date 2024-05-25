import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';

export default class OldPagePresenter {
    public present(data: ResponseCollection): OldPageModel {
        return new OldPageModel();
    }
}
