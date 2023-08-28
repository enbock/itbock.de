import {Start} from 'Application/Start/View/Start';
import ShadowRenderer from '@enbock/ts-jsx/ShadowRenderer';

export default class Controller {
    constructor(
        private document: Document
    ) {
    }

    public start(): void {
        void this.initializeController();
        this.appendStartApp();
    }

    private appendStartApp(): void {
        const rootNode: HTMLElement = ShadowRenderer.render(<Start/>);
        this.document.body.appendChild(rootNode);
    }

    private async initializeController(): Promise<void> {
    }
}
