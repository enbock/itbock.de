import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import AudioInputModel from 'Application/Start/View/Audio/AudioInputModel';
import Adapter from 'Application/Start/Adapter';

interface Properties {
    model: AudioInputModel,
    adapter: Adapter
}

export default class AudioInput extends Component<Properties> {
    render(): ShadowDomElement | ShadowDomElement[] {
        const model: AudioInputModel = this.props.model;
        return <>
            <audio-input
                {...(model.doListening ? {listening: ''} : {})}
                {...(model.microphoneEnabled ? {enabled: ''} : {})}
                onInput={this.onAudioInput.bind(this)}
                onAbort={() => false}
                aria-hidden="true"
            />
        </>;
    }

    private onAudioInput(event: CustomEvent): void {
        void this.props.adapter.audioBlobInput(event.detail as string);
    }
}
