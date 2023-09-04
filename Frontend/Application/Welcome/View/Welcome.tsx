import Component from "@enbock/ts-jsx/Component";
import {ShadowDomElement} from "@enbock/ts-jsx/ShadowDom";
import RootComponent, {ViewModel} from "Application/RootComponent";

interface Properties {
}

export default class Welcome extends Component<Properties> implements RootComponent {
    public set model(model: ViewModel) {
    }

    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <div>Bock Laboratories - Terminal</div>
            <archived-homepages>
                Alte Homepages:
                <ul>
                    <li>
                        <a href={"https://www.itbock.de/2020/index.html"}>Homepage von 2020</a>
                    </li>
                </ul>
            </archived-homepages>
        </>;
    }
}
