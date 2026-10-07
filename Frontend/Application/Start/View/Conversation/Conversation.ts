import ConversationModel from 'Application/Start/View/Conversation/ConversationModel';
import {createElement} from 'Application/Render';
import './Style.css';

export default class Conversation {
    private readonly root: HTMLElement;
    private modelInstance: ConversationModel = new ConversationModel();

    constructor(
        private readonly document: Document
    ) {
        this.root = this.document.createElement('div');
        this.root.className = 'conversation';
    }

    get element(): HTMLElement {
        return this.root;
    }

    set model(value: ConversationModel) {
        this.modelInstance = value;
        this.render();
    }

    private render(): void {
        const items: Array<HTMLElement> = this.modelInstance.conversations.map(
            (conversation: string): HTMLElement => createElement('li', undefined, [conversation])
        );

        this.root.replaceChildren(
            createElement('conversation-list', undefined, [
                createElement('ul', undefined, items)
            ])
        );
    }
}
