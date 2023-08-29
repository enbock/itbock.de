import start from "Application/Start/View/Start";

export default class Controller {
    constructor(
        private document: Document,
        private initializeApplication: typeof start
    ) {
    }

    public start(): void {
        void this.initializeController();
        this.initializeApplication(this.document)
    }


    private async initializeController(): Promise<void> {
    }
}
