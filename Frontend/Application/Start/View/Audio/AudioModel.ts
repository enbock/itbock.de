export default class AudioModel {
    public outputText: string = '';
    public outputAudio: Blob = new Blob([]);
    public showAudio: boolean = false;
    public isLoading: boolean = false;
    public doListening: boolean = false;
    public microphoneEnabled: boolean = false;
}
