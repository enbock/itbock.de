import Component from "@enbock/ts-jsx/Component";
import {ShadowDomElement} from "@enbock/ts-jsx/ShadowDom";
import AudioModel from "Application/Audio/View/AudioModel";

interface Properties {
    model: AudioModel;
}

export default class Audio extends Component<Properties> {
    render(): ShadowDomElement | ShadowDomElement[] {
        const model: AudioModel = this.props.model;
        return model.showAudio ? <audio autoplay={true} src={encodeURI(model.audioSource)} aria-hidden={true}/> : <></>;
    }
}