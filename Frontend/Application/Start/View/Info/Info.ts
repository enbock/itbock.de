import InfoModel, {InfoDocumentModel} from 'Application/Start/View/Info/InfoModel';
import {createElement} from 'Application/Render';
import './Style.css';

export default class Info {
    private readonly root: HTMLElement;
    private modelInstance: InfoModel = new InfoModel();

    constructor(
        private readonly document: Document
    ) {
        this.root = this.document.createElement('div');
        this.root.className = 'info';
    }

    get element(): HTMLElement {
        return this.root;
    }

    set model(value: InfoModel) {
        this.modelInstance = value;
        this.render();
    }

    private render(): void {
        const articles: Array<HTMLElement> = this.modelInstance.documents.map(
            (infoDocument: InfoDocumentModel): HTMLElement => this.renderDocument(infoDocument)
        );

        this.root.replaceChildren(createElement('info-content', undefined, articles));
    }

    private renderDocument(infoDocument: InfoDocumentModel): HTMLElement {
        const children: Array<Node | string> = [
            createElement('h2', undefined, [infoDocument.title])
        ];

        infoDocument.paragraphs.forEach((paragraph: string): void => {
            children.push(createElement('p', undefined, [paragraph]));
        });

        if (infoDocument.url) {
            children.push(
                createElement('p', undefined, [
                    createElement('a', {href: infoDocument.url}, [infoDocument.url])
                ])
            );
        }

        return createElement('article', undefined, children);
    }
}
