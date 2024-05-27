import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import Adapter from 'Application/Start/Adapter';
import StartScreenModel from 'Application/Start/View/StartScreen/StartScreenModel';
import Style from './Style.css';

interface Properties {
    adapter: Adapter;
    model: StartScreenModel;
}

export default class StartScreen extends Component<Properties> {
    private get model(): StartScreenModel {
        return this.props.model;
    }

    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <style>{Style}</style>
            <img src="itbock_terminal.svg" alt={this.model.i18n.imageText}/>
            <button
                right
                onClick={() => this.onStartClick()}
            >
                {this.model.i18n.startLabel}
            </button>
        </>;
    }

    private onStartClick(): void {
        void this.props.adapter.start();
    }
}
