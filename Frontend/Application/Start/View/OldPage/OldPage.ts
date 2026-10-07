import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';
import {createElement} from 'Application/Render';
import './Style.css';

export default class OldPage {
    private readonly root: HTMLElement;
    private modelInstance: OldPageModel = new OldPageModel();

    constructor(
        private readonly document: Document
    ) {
        this.root = this.document.createElement('div');
        this.root.className = 'old-page';
    }

    get element(): HTMLElement {
        return this.root;
    }

    set model(value: OldPageModel) {
        this.modelInstance = value;
        this.render();
    }

    private render(): void {
        const model: OldPageModel = this.modelInstance;

        this.root.replaceChildren(
            model.i18n.title,
            createElement('ul', undefined, [
                createElement('li', undefined, [
                    createElement('a', {href: 'https://www.itbock.de/2020/index.html'}, [model.i18n.linkLabel])
                ])
            ])
        );
    }
}
