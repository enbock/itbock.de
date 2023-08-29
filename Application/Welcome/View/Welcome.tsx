import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from "@enbock/ts-jsx/ShadowDom";

interface Properties {
}

export default class Welcome extends Component<Properties> {
    render(): ShadowDomElement | ShadowDomElement[] {
        return <div>Hello Welcome</div>;
    }
}
