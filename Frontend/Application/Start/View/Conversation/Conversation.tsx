import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import Style from './Style.css';
import ConversationModel from 'Application/Start/View/Conversation/ConversationModel';

interface Properties {
    model: ConversationModel;
}

export default class Conversation extends Component<Properties> {
    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <style>{Style}</style>
            <conversation-list>
                <ul>
                    {this.props.model.conversations.map(s => <li>{s}</li>)}
                </ul>
            </conversation-list>
        </>;
    }
}
