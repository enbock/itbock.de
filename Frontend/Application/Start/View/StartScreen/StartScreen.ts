import Adapter from 'Application/Start/Adapter';
import StartScreenModel from 'Application/Start/View/StartScreen/StartScreenModel';
import {createElement} from 'Application/Render';
import './Style.css';

export default class StartScreen {
    private readonly root: HTMLElement;
    private modelInstance: StartScreenModel = new StartScreenModel();

    constructor(
        private readonly document: Document,
        private readonly adapter: Adapter
    ) {
        this.root = this.document.createElement('div');
        this.root.className = 'start-screen';
    }

    get element(): HTMLElement {
        return this.root;
    }

    set model(value: StartScreenModel) {
        this.modelInstance = value;
        this.render();
    }

    private render(): void {
        const model: StartScreenModel = this.modelInstance;

        const children: Array<Node | string> = [
            createElement('img', {
                src: 'itbock_terminal.svg',
                alt: model.i18n.imageText
            })
        ];

        if (model.showStartButton) {
            const button: HTMLElement = createElement('button', {right: ''}, [model.i18n.startLabel]);
            button.addEventListener('click', (): void => {
                void this.adapter.start();
            });
            children.push(button);
        } else {
            children.push(createElement('p', undefined, [model.i18n.followerHint]));
        }

        this.root.replaceChildren(...children);
    }
}
