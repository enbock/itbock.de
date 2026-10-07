export class InfoDocumentModel {
    public title: string = '';
    public paragraphs: Array<string> = [];
    public url: string | null = null;
}

export default class InfoModel {
    public documents: Array<InfoDocumentModel> = [];
}
