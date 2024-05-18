import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import RootComponent from 'Application/RootComponent';
import WelcomeModel from 'Application/Welcome/View/WelcomeModel';
import Adapter from 'Application/Welcome/Adapter';
import Style from './Welcome.css';

interface Properties {
}

export default class Welcome extends Component<Properties> implements RootComponent {
    private modelInstance: WelcomeModel = new WelcomeModel();

    constructor(
        props: Properties,
        private adapter: Adapter
    ) {
        super(props);
    }

    public get model(): WelcomeModel {
        return this.modelInstance;
    }

    public set model(model: WelcomeModel) {
        this.modelInstance = model;
        this.renderShadow();
    }

    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <style>{Style}</style>
            {this.renderStartButton()}
            {this.renderOldHomepage()}
            {this.renderConversation()}
        </>;
    }

    private renderStartButton(): ShadowDomElement {
        if (this.model.showStart) return <>
            <button right onClick={this.onStartClickHandler}>Start</button>
        </>;

        return <></>;
    }

    private onStartClickHandler: () => void = () => this.onStartClick();

    private onStartClick(): void {
        void this.adapter.closeStart();
    }

    private renderOldHomepage(): ShadowDomElement {
        if (this.model.showOldHomepages) return <>
            <archived-homepages>
                Alte Homepage:
                <ul>
                    <li>
                        <a href={'https://www.itbock.de/2020/index.html'}>Homepage von 2020</a>
                    </li>
                </ul>
            </archived-homepages>
        </>;

        return <></>;
    }

    private renderConversation(): ShadowDomElement {
        if (!this.model.showConversation) return <></>;
        return <>
            <conversation-list>
                <ul>
                    {this.model.conversations.map(s => <li>{s}</li>)}
                </ul>
            </conversation-list>
        </>;
    }
}
