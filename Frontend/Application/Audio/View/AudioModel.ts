import InputModel from 'Application/Audio/View/Input/InputModel';

export default class AudioModel {
    public outputText: string = '';
    public outputAudio: Blob = new Blob([]);
    public showAudio: boolean = false;
    public audioInput: InputModel = new InputModel();
    public isLoading: boolean = false;
}
