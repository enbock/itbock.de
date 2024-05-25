import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import AudioModel from 'Application/Start/View/Audio/AudioModel';
import Adapter from 'Application/Start/Adapter';

interface Properties {
    model: AudioModel,
    adapter: Adapter
}

export default class Audio extends Component<Properties> {
    private outputText: string = '';
    private outputUrl: string = '';
    private lastAudioRenderResult: JSX.Element = '';

    render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <audio-input
                {...(this.props.model.doListening ? {listening: ''} : {})}
                {...(this.props.model.microphoneEnabled ? {enabled: ''} : {})}
                onInput={this.onAudioInput.bind(this)}
                onAbort={this.onAudioInputAborted.bind(this)}
                aria-hidden="true"
            />
            {this.lastAudioRenderResult}
        </>;
    }

    protected renderShadow(): void {
        const text: string = this.outputText;
        this.outputText = this.props.model.outputText;

        if (this.props.model.showAudio != false && this.props.model.outputText != text) {
            this.outputUrl = window.URL.createObjectURL(this.props.model.outputAudio);
            this.renderAudio();
        }
        super.renderShadow();
    }

    private renderAudio(): void {
        this.lastAudioRenderResult = <audio
            autoplay={true}
            src={this.outputUrl}
            aria-hidden="true"
            onEnded={() => this.runComplete()}
            onCanplay={() => this.runLoaded()}
        />;
    }

    private onAudioInput(event: CustomEvent): void {
        void this.props.adapter.audioBlobInput(event.detail as string);
    }

    private onAudioInputAborted(): void {
        void this.props.adapter.audioAbort();
    }

    private async runLoaded(): Promise<void> {
        if (this.props.model.isLoading == false) return;
        await this.props.adapter.audioLoaded();
    }

    private async runComplete(): Promise<void> {
        this.lastAudioRenderResult = '';
        super.renderShadow();
        window.URL.revokeObjectURL(this.outputUrl);
        await this.props.adapter.audioFinished();
    }
}
