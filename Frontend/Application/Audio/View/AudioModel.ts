import InputModel from 'Application/Audio/View/Input/InputModel';

export default class AudioModel {
    public audioSource: string = '';
    public showAudio: boolean = false;
    public audioInput: InputModel = new InputModel();
}
