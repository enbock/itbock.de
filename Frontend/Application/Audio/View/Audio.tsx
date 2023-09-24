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
        this.renderShadow();
    }

    render(): ShadowDomElement | ShadowDomElement[] {
        const model: AudioModel = this.model;
        this.input.model = model.audioInput;
        return model.showAudio ? <audio
            autoplay={true}
            src={encodeURI(model.audioSource)}
            aria-hidden={true}
            onEnded={this.boundComplete}
        /> : <></>;
    }

    private boundComplete: Callback = () => this.onComplete();

    private async onComplete(): Promise<void> {
        await this.adapter.audioFinished();
    }
}