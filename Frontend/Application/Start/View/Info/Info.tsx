import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import Style from './Style.css';
import InfoModel from 'Application/Start/View/Info/InfoModel';

interface Properties {
    model: InfoModel;
}

export default class Info extends Component<Properties> {
    public render(): ShadowDomElement | ShadowDomElement[] {
        return <>
            <style>{Style}</style>
            <info-content>
                {this.props.model.documents.map(document => <article>
                    <h2>{document.title}</h2>
                    {document.paragraphs.map(paragraph => <p>{paragraph}</p>)}
                    {document.url ? <p><a href={document.url}>{document.url}</a></p> : ''}
                </article>)}
            </info-content>
        </>;
    }
}
