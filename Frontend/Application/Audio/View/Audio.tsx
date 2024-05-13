import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import AudioModel from 'Application/Audio/View/AudioModel';
import Input from 'Application/Audio/View/Input/Input';
import RootComponent from 'Application/RootComponent';
import Adapter from 'Application/Audio/Adapter';

interface Properties {
}

export default class Audio extends Component<Properties> implements RootComponent {
    private modelInstance: AudioModel = new AudioModel();
    private outputText: string = '';
    private outputUrl: string = '';

    constructor(
        props: Properties,
        private adapter: Adapter,
        private input: Input
    ) {
        super(props);
    }

    public get model(): AudioModel {
        return this.modelInstance;
    }

    public set model(value: AudioModel) {
        this.modelInstance = value;
        this.input.model = value.audioInput;
    }

    render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <a href={this.outputUrl}>DL</a>
            <audio
                autoplay={true}
                src={this.outputUrl}
                aria-hidden={true}
                onEnded={this.onComplete}
                onCanplay={this.onLoaded}
            />
        </>;
    }

    protected renderShadow(): void {
        const text: string = this.outputText;
        this.outputText = this.model.outputText;
        if (this.model.showAudio == false || this.model.outputText == text) return;
        this.outputUrl = window.URL.createObjectURL(this.model.outputAudio);
        super.renderShadow();
    }

    private onComplete: Callback = () => this.runComplete();
    private onLoaded: Callback = () => this.runLoaded();

    private async runLoaded(): Promise<void> {
        if (this.model.isLoading == false) return;
        await this.adapter.audioLoaded();
    }

    private async runComplete(): Promise<void> {
        window.URL.revokeObjectURL(this.outputUrl);
        await this.adapter.audioFinished();
    }
}
