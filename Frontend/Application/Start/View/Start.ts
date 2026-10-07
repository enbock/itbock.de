import Adapter from 'Application/Start/Adapter';
import AudioInput from 'Application/Start/View/Audio/AudioInput';
import Conversation from 'Application/Start/View/Conversation/Conversation';
import Info from 'Application/Start/View/Info/Info';
import OldPage from 'Application/Start/View/OldPage/OldPage';
import StartModel from 'Application/Start/View/StartModel';
import StartScreen from 'Application/Start/View/StartScreen/StartScreen';
import {createElement} from 'Application/Render';
import './Start.css';

export default function renderApplication(document: Document, adapter: Adapter): Start {
    const startView: Start = new Start(document, adapter);
    document.body.appendChild(startView.element);
    return startView;
}

export class Start {
    private readonly root: HTMLElement;
    private modelInstance: StartModel = new StartModel({} as any);
    private readonly startScreen: StartScreen;
    private readonly conversation: Conversation;
    private readonly oldPage: OldPage;
    private readonly info: Info;
    private readonly audioInput: AudioInput;

    constructor(
        private readonly document: Document,
        private readonly adapter: Adapter
    ) {
        this.root = this.document.createElement('div');
        this.root.className = 'start';

        this.startScreen = new StartScreen(this.document, this.adapter);
        this.conversation = new Conversation(this.document);
        this.oldPage = new OldPage(this.document);
        this.info = new Info(this.document);
        this.audioInput = new AudioInput(this.document, this.adapter);
    }

    get element(): HTMLElement {
        return this.root;
    }

    get model(): StartModel {
        return this.modelInstance;
    }

    set model(value: StartModel) {
        this.modelInstance = value;
        this.startScreen.model = value.startScreen;
        this.conversation.model = value.conversation;
        this.oldPage.model = value.oldPage;
        this.info.model = value.info;
        this.audioInput.model = value.audio;
        this.render();
    }

    private render(): void {
        const model: StartModel = this.modelInstance;

        this.document.firstElementChild?.setAttribute('lang', model.languageCode);

        this.root.replaceChildren(
            this.renderMainTitle(model),
            this.renderSubHeader(model),
            this.renderPageSection(model),
            this.renderMenuSection(),
            this.audioInput.element
        );
    }

    private renderMainTitle(model: StartModel): HTMLElement {
        const mainTitle: HTMLElement = createElement('main-title');
        const content: HTMLElement = createElement('content', undefined, [
            createElement('page--title', undefined, [model.i18n.pageTitle])
        ]);
        if (model.showThinking) {
            content.append(createElement('h3', undefined, [model.i18n.loadingText]));
        }

        mainTitle.append(
            content,
            createElement('button--block', undefined, [model.language]),
            createElement('splitter-1'),
            createElement('splitter-2'),
            createElement('splitter-3'),
            createElement('splitter-4'),
            createElement('splitter-5'),
            createElement('splitter-6')
        );

        return mainTitle;
    }

    private renderSubHeader(model: StartModel): HTMLElement {
        const subHeader: HTMLElement = createElement('sub-header');
        const content: HTMLElement = createElement('content');
        if (model.showAudioText) {
            content.append(createElement('h3', undefined, [model.audioText]));
        }

        subHeader.append(
            content,
            createElement('splitter-1'),
            createElement('splitter-2'),
            createElement('splitter-3'),
            createElement('splitter-4'),
            createElement('splitter-5'),
            createElement('splitter-6')
        );

        return subHeader;
    }

    private renderPageSection(model: StartModel): HTMLElement {
        const pageSection: HTMLElement = createElement('page-section');

        if (model.showStartScreen) pageSection.append(this.startScreen.element);
        if (model.showConversation) pageSection.append(this.conversation.element);
        if (model.showOldPage) pageSection.append(this.oldPage.element);
        if (model.showInfo) pageSection.append(this.info.element);

        return pageSection;
    }

    private renderMenuSection(): HTMLElement {
        return createElement('menu-section', undefined, [
            createElement('filler-1'),
            createElement('filler-2'),
            createElement('filler-3'),
            createElement('filler-4')
        ]);
    }
}
