import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import AudioModel from 'Application/Audio/View/AudioModel';
import RootComponent from 'Application/RootComponent';
import Adapter from 'Application/Audio/Adapter';

interface Properties {
}

export default class Audio extends Component<Properties> implements RootComponent {
    private modelInstance: AudioModel = new AudioModel();
    private outputText: string = '';
    private outputUrl: string = '';
    private lastAudioRenderResult: JSX.Element = '';

    constructor(
        props: Properties,
        private adapter: Adapter
    ) {
        super(props);
    }

    public get model(): AudioModel {
        return this.modelInstance;
    }

    public set model(value: AudioModel) {
        this.modelInstance = value;
        console.log('AudioModel:', value);
        this.renderShadow();
    }

    render(): ShadowDomElement | ShadowDomElement[] {
        console.log('>>>RENDER', this.model);
        // noinspection SpellCheckingInspection
        return <>
            <audio-input
                {...(this.model.doListening ? {dolistening: ''} : {})}
                {...(this.model.microphoneEnabled ? {enabled: ''} : {})}
                onAudioinput={this.onAudioInput.bind(this)}
                onAudioabort={this.onAudioInputAborted.bind(this)}
                aria-hidden="true"
                silentcounter="30"
            />
            {this.lastAudioRenderResult}
        </>;
    }

    private renderAudio(): void {
        this.lastAudioRenderResult = <audio
            autoplay={true}
            src={this.outputUrl}
            aria-hidden="true"
            onEnded={this.onComplete}
            onCanplay={this.onLoaded}
        />;
    }

    protected renderShadow(): void {
        const text: string = this.outputText;
        this.outputText = this.model.outputText;

        if (this.model.showAudio != false && this.model.outputText != text) {
            this.outputUrl = window.URL.createObjectURL(this.model.outputAudio);
            this.renderAudio();
        }
        super.renderShadow();
    }

    private onComplete: Callback = () => this.runComplete();
    private onLoaded: Callback = () => this.runLoaded();

    private onAudioInput(event: CustomEvent): void {
        void this.adapter.audioBlobInput(event.detail as string);
    }

    private onAudioInputAborted(): void {
        void this.adapter.audioAbort();
    }

    private async runLoaded(): Promise<void> {
        if (this.model.isLoading == false) return;
        await this.adapter.audioLoaded();
    }

    private async runComplete(): Promise<void> {
        this.lastAudioRenderResult = '';
        super.renderShadow();
        window.URL.revokeObjectURL(this.outputUrl);
        await this.adapter.audioFinished();
    }
}
