import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from "@enbock/ts-jsx/ShadowDom";

interface Properties {
}

export default class Start extends Component<Properties> {
    render(): ShadowDomElement | ShadowDomElement[] | JSX.Element {
        return <div>Hello World</div>;
    }
}
