import Welcome from "Application/Welcome/View/Welcome";
import RootComponent from "Application/RootComponent";
import AddAudioTextUseCase from "Core/Audio/AddTextUseCase/AddAudioTextUseCase";
import ModuleController from "Application/ModuleController";

export default class Controller implements ModuleController {
    private view?: RootComponent;

    constructor(
        view: typeof Welcome,
        private addAudioText: AddAudioTextUseCase
    ) {
        view.componentReceiver = this;
    }

    public setComponent(view: RootComponent): void {
        this.view = view;
    }

    public async init(): Promise<void> {
        this.addAudioText.addText({text: "Bock Laboratories: Terminal! Noch nicht bereit!"});
        this.addAudioText.addText({text: "Die Homepage aus dem Jahre 2020 kann über den angezeigten Link erreicht werden."});
    }
}
