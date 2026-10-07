import ResponseCollection from 'Application/Start/Controller/Response/ResponseCollection';
import InfoModel, {InfoDocumentModel} from 'Application/Start/View/Info/InfoModel';

export default class InfoPresenter {
    public present(data: ResponseCollection): InfoModel {
        const model: InfoModel = new InfoModel();
        model.documents = data.replication.documents.map(document => {
            const item: InfoDocumentModel = new InfoDocumentModel();
            item.title = document.title;
            item.paragraphs = document.text
                .split(/\r?\n\r?\n/g)
                .map(paragraph => paragraph.trim())
                .filter(paragraph => paragraph.length > 0)
            ;
            item.url = document.url;

            return item;
        });

        return model;
    }
}
