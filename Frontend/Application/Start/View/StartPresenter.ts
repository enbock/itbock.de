import StartModel from 'Application/Start/View/StartModel';
import StateResponse from 'Application/Start/Controller/StateResponse';
import AudioPresenter from 'Application/Audio/View/AudioPresenter';
import AudioInputPresenter from 'Application/Audio/Input/InputPresenter';

export default class StartPresenter {
    constructor(
        private audioPresenter: AudioPresenter,
        private audioInputPresenter: AudioInputPresenter
    ) {
    }

    public presentData(state: StateResponse): StartModel {
        const model: StartModel = new StartModel();

        model.audio = this.audioPresenter.present(state.text);
        model.audioInput = this.audioInputPresenter.present(state);
        model.showStart = state.applicationStarted == false;
        model.bypass = state;

        return model;
    }
}
