import InputModel from 'Application/Audio/View/Input/InputModel';
import StateResponse from 'Application/Audio/Controller/StateResponse';

export default class InputPresenter {
    public present(data: StateResponse): InputModel {
        const model: InputModel = new InputModel();

        model.doListening = data.audioInputEnabled == true;
        model.language = data.language;
        model.microphoneEnabled = data.microphoneEnable == true;

        return model;
    }
}
