import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from "@enbock/ts-jsx/ShadowDom";
import ShadowRenderer from "@enbock/ts-jsx/ShadowRenderer";

interface Properties {
}

export default function renderApplication(document: Document) {
    const rootNode: HTMLElement = ShadowRenderer.render(<Start/>);
    document.body.appendChild(rootNode);
}

class Start extends Component<Properties> {
    render(): ShadowDomElement | ShadowDomElement[] {
        return <div>Hello World</div>;
    }
}
