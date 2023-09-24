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
    private outputCache: string = '';

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
            <audio
                autoplay={true}
                src={this.outputCache}
                aria-hidden={true}
                onEnded={this.onComplete}
                onCanplay={this.onLoaded}
            />
        </>;
    }

    protected renderShadow(): void {
        const cache: string = this.outputCache;
        this.outputCache = this.model.audioSource;
        if (this.model.showAudio == false || this.model.audioSource == cache) return;
        super.renderShadow();
    }

    private onComplete: Callback = () => this.runComplete();
    private onLoaded: Callback = () => this.runLoaded();

    private async runLoaded(): Promise<void> {
        if (this.model.isLoading == false) return;
        await this.adapter.audioLoaded();
    }

    private async runComplete(): Promise<void> {
        await this.adapter.audioFinished();
    }
}