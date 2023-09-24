import InputModel from 'Application/Audio/View/Input/InputModel';
import StateResponse from 'Application/Audio/Controller/StateResponse';

export default class InputPresenter {
    public present(data: StateResponse): InputModel {
        const input: InputModel = new InputModel();
        input.doListening = data.audioInputEnabled == true;
        return input;
    }
}
