import CommandHandler from 'Application/Command/CommandHandler';
import OldHomepageUseCase from 'Core/Welcome/OldHomepageUseCase/OldHomepageUseCase';

export default class OldHomepageHandler implements CommandHandler {
    constructor(
        private oldHomepageUseCase: OldHomepageUseCase
    ) {
    }

    public async run(): Promise<void> {
        this.oldHomepageUseCase.showLinkToHomepage();
    }

    public support(command: string): boolean {
        return command == 'openOldPage';
    }
}
