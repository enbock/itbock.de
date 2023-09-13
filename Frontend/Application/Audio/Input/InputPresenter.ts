import StateResponse from 'Application/Start/Controller/StateResponse';
import InputModel from 'Application/Audio/Input/InputModel';

export default class InputPresenter {
    public present(data: StateResponse): InputModel {
        const input: InputModel = new InputModel();
        input.takeSpeech = data.applicationStarted == true && data.isPlaying == false && data.muted == false;
        return input;
    }
}
