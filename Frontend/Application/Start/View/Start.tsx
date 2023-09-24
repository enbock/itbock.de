import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import ShadowRenderer from '@enbock/ts-jsx/ShadowRenderer';
import Audio from 'Application/Audio/View/Audio';
import StartModel from 'Application/Start/View/StartModel';
import RootComponent from 'Application/RootComponent';
import Adapter from 'Application/Start/Adapter';
import Welcome from 'Application/Welcome/View/Welcome';

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
        private adapter: Adapter
    ) {
        super(props);
    }

    public get model(): StartModel {
        return this.modelInstance;
    }

    public set model(value: StartModel) {
        this.modelInstance = value;
        this.renderShadow();
    }

    render(): ShadowDomElement | ShadowDomElement[] {
        const model: StartModel = this.modelInstance;
        let output: ShadowDomElement = this.getOutput(model);

        return <>
            {output}
            {model.showThinking ? <h3>Ich denke, bitte warten..</h3> : <></>}
            {model.showAudioSpooling ? <h3>Audiospur wird geladen, bitte warten..</h3> : <></>}
        </>;
    }

    private getOutput(model: StartModel): ShadowDomElement {
        if (model.showStart) return <>
            <button style="font-size: 3rem" onClick={this.onStartClickHandler}>Start</button>
        </>;

        if (model.showApplication == true) return <>
            <Welcome/>
            <Audio/>
        </>;

        return <></>;
    }

    private onStartClickHandler: () => void = () => this.onStartClick();

    private onStartClick(): void {
        void this.adapter.closeStart();
    }
}
