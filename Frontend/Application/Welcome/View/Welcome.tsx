import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import RootComponent from 'Application/RootComponent';
import WelcomeModel from 'Application/Welcome/View/WelcomeModel';

interface Properties {
}

export default class Welcome extends Component<Properties> implements RootComponent {
    private modelInstance: WelcomeModel = new WelcomeModel();

    public get model(): WelcomeModel {
        return this.modelInstance;
    }

    public set model(model: WelcomeModel) {
        this.modelInstance = model;
        this.renderShadow();
    }

    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            {this.model.showOldHomepages ? (
                <archived-homepages>
                    Alte Homepages:
                    <ul>
                        <li>
                            <a href={'https://www.itbock.de/2020/index.html'}>Homepage von 2020</a>
                        </li>
                    </ul>
                </archived-homepages>
            ) : ''}
        </>;
    }
}
