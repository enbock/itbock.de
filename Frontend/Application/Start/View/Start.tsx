import Component from "@enbock/ts-jsx/Component";
import {ShadowDomElement} from "@enbock/ts-jsx/ShadowDom";
import ShadowRenderer from "@enbock/ts-jsx/ShadowRenderer";
import Audio from "Application/Audio/View/Audio";
import StartModel from "Application/Start/View/StartModel";
import RootComponent from "Application/RootComponent";
import Adapter from "Application/Start/Adapter";
import Welcome from "Application/Welcome/View/Welcome";

interface Properties {
}

export default function renderApplication(document: Document) {
    const rootNode: HTMLElement = ShadowRenderer.render(<Start/>);
    document.body.appendChild(rootNode);
}

export class Start extends Component<Properties> implements RootComponent {
    public name: string = "Start";
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

        if (model.showStart) return <button onClick={this.adapter.closeStart}>Start</button>;

        return <>
            <Audio model={model.audio}/>
            <Welcome/>
        </>;
    }
}
