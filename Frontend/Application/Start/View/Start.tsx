import Component from '@enbock/ts-jsx/Component';
import {ShadowDomElement} from '@enbock/ts-jsx/ShadowDom';
import ShadowRenderer from '@enbock/ts-jsx/ShadowRenderer';
import Audio from 'Application/Audio/View/Audio';
import StartModel from 'Application/Start/View/StartModel';
import RootComponent from 'Application/RootComponent';
import Welcome from 'Application/Welcome/View/Welcome';
import Style from './Start.css';

interface Properties {
}

export default function renderApplication(document: Document) {
    const rootNode: HTMLElement = ShadowRenderer.render(<Start/>);
    document.body.appendChild(rootNode);
}

export class Start extends Component<Properties> implements RootComponent {
    private modelInstance: StartModel = new StartModel();

    constructor(
        props: Readonly<Properties>
    ) {
        super(props);
    }

    public get model(): StartModel {
        return this.modelInstance;
    }

    public set model(value: StartModel) {
        this.modelInstance = value;
        this.renderShadow();
    }

    render(): ShadowDomElement | ShadowDomElement[] {
        const model: StartModel = this.modelInstance;

        return <>
            <style>{Style}</style>
            <Audio/>
            <main-title>
                <content>
                    <page--title>Bock Laboratories - Terminal</page--title>
                    {model.showThinking ? <h3>Ich denke, bitte warten...</h3> : <></>}
                    {model.showAudioSpooling ? <h3>Audiospur wird geladen, bitte warten...</h3> : <></>}
                </content>
                <button--block/>
                <splitter-1/>
                <splitter-2/>
                <splitter-3/>
                <splitter-4/>
                <splitter-5/>
                <splitter-6/>
            </main-title>
            <sub-header>
                <content>
                    {model.showAudioText ? <h3>{model.audioText}</h3> : <></>}
                </content>
                <splitter-1/>
                <splitter-2/>
                <splitter-3/>
                <splitter-4/>
                <splitter-5/>
                <splitter-6/>
            </sub-header>
            <page-section>
                {this.getOutput()}
            </page-section>
            <menu-section>
                <filler-1/>
                <filler-2/>
                <filler-3/>
                <filler-4/>
            </menu-section>
        </>;
    }

    private getOutput(): ShadowDomElement {
        return <>
            <Welcome/>
        </>;
    }
}
