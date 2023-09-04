import StartModel from "Application/Start/View/StartModel";
import StateResponse from "Application/Start/Controller/StateResponse";
import AudioPresenter from "Application/Audio/View/AudioPresenter";

export default class StartPresenter {
    constructor(
        private audioPresenter: AudioPresenter
    ) {
    }

    public presentData(state: StateResponse): StartModel {
        const model: StartModel = new StartModel();

        model.audio = this.audioPresenter.present(state.text);
        model.showStart = state.hasStarted == false;

        return model;
    }
}
