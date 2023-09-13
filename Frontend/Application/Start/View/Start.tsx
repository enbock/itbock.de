import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import ShadowRenderer from '@enbock/ts-jsx/ShadowRenderer';
import Audio from 'Application/Audio/View/Audio';
import StartModel from 'Application/Start/View/StartModel';
import RootComponent from 'Application/RootComponent';
import Adapter from 'Application/Start/Adapter';
import Welcome from 'Application/Welcome/View/Welcome';
import AudioInput from 'Application/Audio/Input/Input';
import Container from 'Application/DependencyInjection/Container';

interface Properties {
}

export default function renderApplication(document: Document) {
    const rootNode: HTMLElement = ShadowRenderer.render(<Start/>);
    document.body.appendChild(rootNode);
}

export class Start extends Component<Properties> implements RootComponent {
    private modelInstance: StartModel = new StartModel();

    constructor(
        props: Readonly<Properties>,
        private adapter: Adapter,
        private audioInput: AudioInput
    ) {
        super(props);
    }

    public get model(): StartModel {
        return this.modelInstance;
    }

    public set model(value: StartModel) {
        this.modelInstance = value;
        this.audioInput.model = value.audioInput;
        this.renderShadow();
    }

    render(): ShadowDomElement | ShadowDomElement[] {
        const model: StartModel = this.modelInstance;

        const debug: ShadowDomElement = <p>
            <b>Debug:</b><br/>
            {Object.keys(model.bypass).map(x => <>
                <b>{x}</b>
                <div
                    style={'margin-left: 1rem; padding: 0.2rem; border: 1px solid black; font-family: monospace'}
                >{(model.bypass as any)[x] || 'false'}</div>
                <br/>
            </>)}

            <b>Conversation:</b><br/>
            {Container.coreGptConversationStorage.getConversations().map(x => [
                <i>Role: {x.role}</i>,
                <div
                    style="margin-left: 1rem; padding: 0.2rem; border: 1px solid black; font-family: monospace"
                >{x.text}</div>
            ])}
        </p>;

        if (model.showStart) return <>
            <button style="font-size: 3rem" onClick={this.adapter.closeStart}>Start</button>
            {debug}
        </>;

        return <>
            <Audio model={model.audio}/>
            <Welcome/>
            {debug}
        </>;
    }
}
