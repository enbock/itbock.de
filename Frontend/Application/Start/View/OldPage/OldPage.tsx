import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import Style from './Style.css';
import OldPageModel from 'Application/Start/View/OldPage/OldPageModel';

interface Properties {
    model: OldPageModel;
}

export default class OldPage extends Component<Properties> {
    private get model(): OldPageModel {
        return this.props.model;
    }

    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <style>{Style}</style>
            {this.model.i18n.title}
            <ul>
                <li>
                    <a href={'https://www.itbock.de/2020/index.html'}>{this.model.i18n.linkLabel}</a>
                </li>
            </ul>
        </>;
    }
}
