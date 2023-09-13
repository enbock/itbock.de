import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import AudioModel from 'Application/Audio/View/AudioModel';
import StartAdapter from 'Application/Start/Adapter';

interface Properties {
    model: AudioModel;
}

export default class Audio extends Component<Properties> {
    constructor(
        props: Properties,
        private adapter: StartAdapter
    ) {
        super(props);
    }

    private boundComplete: Callback = () => this.onComplete();

    render(): ShadowDomElement | ShadowDomElement[] {
        const model: AudioModel = this.props.model;
        return model.showAudio ? <audio
            autoplay={true}
            src={encodeURI(model.audioSource)}
            aria-hidden={true}
            onEnded={this.boundComplete}
        /> : <></>;
    }

    private async onComplete(): Promise<void> {
        await this.adapter.audioFinished();
    }
}