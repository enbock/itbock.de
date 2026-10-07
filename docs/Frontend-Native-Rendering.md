# Frontend-Native-Rendering

Status: in Umsetzung. Dieses Dokument ist Plan **und** Vertrag zwischen den umsetzenden Sub-Agents.

## Ziel

Die Ansicht des Frontends wird von JSX/`@enbock/ts-jsx` + Shadow-DOM auf **natives HTML** umgestellt:

- **Kein TSX/ts-jsx**: Die Views sind normales TypeScript und erzeugen ihre DOM-Knoten direkt
  (`document.createElement` bzw. ein kleiner `createElement`-Helper). Kein JSX, kein `Component`,
  kein `ShadowRenderer`, kein `ViewInjection`, kein `ShadowComponentReceiver`.
- **Kein Shadow Root**: Die Views rendern in den normalen DOM-Baum von `document.body`. CSS ist global
  (keine `:host`-Selektoren mehr, keine inline `<style>`-Tags in Views).
- **CSS klassisch über webpack**: CSS wird per `import './*.css'` (Side-Effect) eingebunden und über
  `style-loader` + `css-loader` einkompiliert. `@import`-Auflösung läuft über webpack (Alias `theme`).
- **jsdom und ts-jsx entfernen** (inkl. `@types/jsdom`).
- **Tests co-located**: `*.test.ts` liegen im selben Ordner wie die Quell-Datei, nicht mehr unter `test/`.

## Ist-Stand (Ausgangslage)

- 6 View-Dateien sind `.tsx` und nutzen `@enbock/ts-jsx` (`Component`, `ShadowDomElement`,
  `ShadowRenderer.render`, `<>…</>`-Fragmente):
  `Start.tsx`, `StartScreen.tsx`, `Conversation.tsx`, `Info.tsx`, `OldPage.tsx`, `AudioInput.tsx`.
- Jede View importiert CSS als String (`import Style from './*.css'`, css-loader `exportType: 'string'`,
  `import: false`) und bettet es als `<style>{Style}</style>` im Shadow-DOM ein. Die CSS nutzen `:host`
  und `@import "theme/…"`.
- `Controller`/`ModuleController` implementieren `ShadowComponentReceiver`; `Container` injiziert den
  `Adapter` über `ViewInjection(Start, adapter)`. `renderApplication` ruft `ShadowRenderer.render(<Start/>)`.
- `webpack.config.js`: ts-loader für `\.tsx?$`, css-loader als String-Export.
- `tsconfig.json`: `"jsx": "react-jsx"`, `"jsxImportSource": "@enbock/ts-jsx"`.
- `global.d.ts`: JSX-Namespace, `declare module '*.css'` (Default-Export) und ungenutzte Jasmine-Aliase.
- Tests unter `Frontend/test/{Core,Leader}/**/*.test.ts`, Start via `node --import tsx --test test/**/*.test.ts`.
- Abhängigkeiten `@enbock/ts-jsx`, `jsdom`, `@types/jsdom` sind installiert.

## Architektur (Ziel)

### DOM-Baum

`renderApplication(document, adapter)` erzeugt eine `Start`-View, hängt deren Root an `document.body`
und gibt die View zurück. Die Root-Elemente tragen feste Klassen (Vertrag für CSS):

| View | Datei | Root-Element | Klasse |
|------|-------|--------------|--------|
| Start | `Application/Start/View/Start.ts` | `<div>` | `start` |
| StartScreen | `…/StartScreen/StartScreen.ts` | `<div>` | `start-screen` |
| Conversation | `…/Conversation/Conversation.ts` | `<div>` | `conversation` |
| Info | `…/Info/Info.ts` | `<div>` | `info` |
| OldPage | `…/OldPage/OldPage.ts` | `<div>` | `old-page` |
| AudioInput | `…/Audio/AudioInput.ts` | `<audio-input>` (Custom Element) | – |

Die bisherigen Custom-Element-Namen (`main-title`, `sub-header`, `page-section`, `menu-section`,
`splitter-1…6`, `filler-1…4`, `content`, `button--block`, `page--title`, `conversation-list`,
`info-content`) bleiben als Tag-Namen erhalten; sie sind normale (nicht registrierte) Elemente und
werden weiterhin per Element-Selektor gestylt. Das `<audio-input>`-Web-Component bleibt unverändert.

Struktur der `Start`-View (wie bisher, nur ohne `<style>` und ohne Shadow-DOM):

```
div.start
├── main-title  (content, button--block, splitter-1…6)
├── sub-header  (content, splitter-1…6)
├── page-section   ← aktive Sub-View (start-screen | conversation | info | old-page)
├── menu-section  (filler-1…4)
└── audio-input
```

### Render-Helper

Neue Datei `Application/Render.ts` (einmalig, von allen Views genutzt):

```ts
export function createElement(
    tagName: string,
    attributes?: Record<string, string>,
    children?: Array<Node | string>
): HTMLElement;
```

- erzeugt `document.createElement(tagName)`, setzt Attribute via `setAttribute`, hängt Kinder via
  `element.append(...children)` an (Strings werden zu Text-Knoten → **kein XSS** über `innerHTML`).
- Dynamische Texte (Conversation, Info-Dokumente, Titel) werden **immer** als String-Kind übergeben,
  nie als `innerHTML`.

### View-Klassen (Muster)

Jede View ist eine Klasse mit `element`-Getter und `model`-Setter (Re-Render bei neuem Modell):

```ts
export default class StartScreen {
    private readonly root: HTMLElement;
    private modelInstance: StartScreenModel = new StartScreenModel();

    constructor(
        private readonly document: Document,
        private readonly adapter: Adapter
    ) {
        this.root = this.document.createElement('div');
        this.root.className = 'start-screen';
    }

    get element(): HTMLElement { return this.root; }

    set model(value: StartScreenModel) {
        this.modelInstance = value;
        this.render();
    }

    private render(): void { /* root.replaceChildren(…) mit createElement */ }
}
```

- `Start` hält die vier Sub-Views (StartScreen, Conversation, Info, OldPage) und die AudioInput-View als
  Instanzen; bei `model`-Set aktualisiert sie deren Modelle und baut den eigenen Baum neu auf (nur die
  aktive Sub-View wird in `page-section` eingehängt).
- `AudioInput` erzeugt `<audio-input>` und bindet `onaudioinput` (ruft `adapter.audioBlobInput(event.detail)`)
  sowie ggf. `onaudioabort`. Der `AudioInput`-View importiert den Typ `UIAudioInputElement` aus
  `UI/AudioInput/UIAudioInputElement` zum Casten. Attribute `listening`/`enabled` werden wie bisher
  (leeres Attribut) gesetzt.

### Verdrahtung (Controller / Container / ModuleController)

- `renderApplication(document: Document, adapter: Adapter): Start` (Default-Export) und `export class Start`.
- `Controller` implementiert **kein** `ShadowComponentReceiver` mehr. Konstruktor:

  ```ts
  constructor(
      document: Document,
      renderApplication: (document: Document, adapter: Adapter) => Start,
      adapter: Adapter,
      startUseCase: StartUseCase,
      presenter: StartPresenter,
      moduleControllers: Array<ModuleController>,
      handlers: Array<ControllerHandler>,
      dataCollector: DataCollector,
      defaultLanguage: string,
      audioInputUseCase: AudioInputUseCase
  )
  ```

  `start()`: `audioInputUseCase.initialize()` → `await initializeController()` (Handlers + `startModules()`,
  **ohne** `presentData`) → `this.startView = this.renderApplication(this.document, this.adapter)` →
  `await this.presentData()`. `presentData()` setzt `this.startView.model = this.presenter.presentData(data)`.
- `ModuleController` ist nur noch `{ initialize(): Promise<void>; }`.
- `Container`: `ViewInjection`-Import und `-Aufruf entfernen; `StartController` bekommt statt `Start` die
  `this.startAdapter`. `import renderApplication from 'Application/Start/View/Start'` (ohne `{Start}`).
- `Application/RootComponent.ts` (mit `ViewModel`/`RootComponent`) wird **gelöscht** (nur noch von `Start.tsx`
  genutzt).

### CSS

- `webpack.config.js`: ts-loader-Regel `test: /\.ts$/`; `resolve.extensions` → `['.ts', '.js']`.
  CSS-Regel ersetzt durch `use: ['style-loader', 'css-loader']`. Alias ergänzen:
  `theme: path.resolve(__dirname, 'Application/theme')`.
- `Application/index.ts` bindet `import './theme/variables.css'; import './theme/global.css';` ein.
- `Application/public/index.html`: die beiden `<link href="theme/…css">` entfernen.
- `:host`-Selektoren werden auf die Root-Klassen umgestellt:

  | Datei | `:host` → |
  |-------|-----------|
  | `Start/View/Start.css` | `.start` |
  | `StartScreen/Style.css` | `.start-screen` |
  | `Conversation/Style.css` | `.conversation` |
  | `Info/Style.css` | `.info` |
  | `OldPage/Style.css` | `.old-page` |

  Die `@import "theme/…"` bleiben (webpack-Alias `theme` löst sie auf). Fonts (`rem.css` → `url(…woff2)`)
  laufen über die vorhandene `asset/resource`-Regel. Das CopyPlugin-Kopieren von `Application/theme` darf
  bleiben (harmlos) oder entfernt werden.

### Tooling / Typen

- `package.json`: `@enbock/ts-jsx`, `jsdom`, `@types/jsdom` entfernen; `style-loader` ergänzen.
  `test`-Script: `node --import tsx --test "**/*.test.ts"`.
- `tsconfig.json`: `"jsx"` und `"jsxImportSource"` entfernen (Rest bleibt).
- `global.d.ts`: nur noch behalten
  ```ts
  type Callback<Function = () => Promise<void>> = Function;
  type JsonData = any;

  declare module '*.css';
  ```
  (JSX-Namespace, `import SpyObj = jasmine.SpyObj`, `throwsError*`, `MockedObject` entfernen.)

### Tests co-located

| Quelle (bisher) | Ziel (neu) |
|-----------------|------------|
| `test/Core/Gpt/ConversationUseCase.test.ts` | `Core/Gpt/ConversationUseCase/ConversationUseCase.test.ts` |
| `test/Core/Replication/SessionService.test.ts` | `Core/Replication/SessionService.test.ts` |
| `test/Core/Start/ReplicationUseCase.test.ts` | `Core/Start/ReplicationUseCase/ReplicationUseCase.test.ts` |
| `test/Leader/AudioPresenter.test.ts` | `Application/Start/View/Audio/AudioPresenter.test.ts` |
| `test/Leader/LeaderElection.test.ts` | `Infrastructure/Replication/LeaderElection/LeaderElection.test.ts` |
| `test/Leader/LeaderUseCase.test.ts` | `Core/Replication/LeaderUseCase/LeaderUseCase.test.ts` |

Leeres `test/`-Verzeichnis entfernen. Die Import-Pfade (`Core/…`, `Application/…`) bleiben unverändert
(tsconfig-`paths`).

## Umsetzungsplan mit Sub-Agents

Gemeinsame Regeln: `.github/instructions/*` lesen (4 Spaces, max. 120 Zeichen, Typen überall, `Array<T>`,
Konstruktor-Injection mit `private`, keine unnötigen Kommentare), **keine Git-Commits/Branches/Pushes**,
keine `.env` lesen, nur die jeweils zugewiesenen Dateien anfassen, kein `npm install`/Build/Test
(das übernimmt die Integration am Ende).

| Welle | Agent | Auftrag | Schreibt nur in |
|-------|-------|---------|-----------------|
| 1 | **A – View & Wiring** | `Application/Render.ts` neu; 6 `.tsx` → `.ts` (nativ, Klassen `start`/`start-screen`/`conversation`/`info`/`old-page`, `audio-input`); CSS-Import als Side-Effect; `Controller.ts`, `Container.ts`, `ModuleController.ts` entkoppeln; `RootComponent.ts` löschen | `Application/**` (View, Controller, Container, ModuleController, Render, RootComponent) |
| 1 | **B – Tooling, CSS, Tests** | `webpack.config.js`, `tsconfig.json`, `package.json`, `global.d.ts`, `index.html`, `Application/index.ts` (CSS-Imports); 5 CSS-Dateien `:host`→Klasse; 6 Test-Dateien co-located verschieben, `test/` löschen | `webpack.config.js`, `tsconfig.json`, `package.json`, `Application/global.d.ts`, `Application/public/index.html`, `Application/index.ts`, 5 CSS-Dateien, 6 Test-Dateien (+ `test/`-Löschung) |

Welle 1 läuft **parallel** (disjunkte Dateien). Danach Integration (Agent-Mutter):

- `npm install` (Abhängigkeiten aktualisieren)
- `npm test` (Node 24, Glob `**/*.test.ts`)
- `npm run build` (webpack production)
- `npx tsc --noEmit` (Typcheck)

## Abnahme

- `npm test` grün (6 Tests, co-located).
- `npm run build` grün; im `build/`-Output keine `.tsx`/Shadow-DOM-Artefakte; CSS als `<style>`/Bundled
  enthalten (style-loader) und `:host`-frei.
- Keine Referenzen mehr auf `@enbock/ts-jsx`, `jsdom`, `@types/jsdom`, `ShadowRenderer`, `ShadowDomElement`,
  `ShadowComponentReceiver`, `ViewInjection` im Quellcode.
- README (Wurzel) aktualisiert: „Web Components/Shadow DOM“-Erwähnung anpassen, Technologie-Liste
  (TSX/ts-jsx/jsdom raus, CSS via webpack/style-loader rein), Test-Lage (co-located) ergänzen.
