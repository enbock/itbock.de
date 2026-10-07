# Replication-Feature

Status: in Umsetzung. Dieses Dokument ist Plan **und** Vertrag zwischen Backend, Frontend und den
umsetzenden Sub-Agents.

## Ziel

Das Backend hält den Zustand der Seite (welche Seite sichtbar ist, welche Daten sie zeigt, Gesprächsverlauf) in einer
**Session**. Das Frontend ist nur noch Ansicht + Ein-/Ausgabe.

- Das Frontend erzeugt die `sessionId` (UUID v4 via `crypto.randomUUID()`) und legt sie im `localStorage` ab.
  Jeder Tab/Neustart im selben Browser hat damit dieselbe Ansicht und denselben Zustand.
- Jede Änderung ist in **allen** Tabs sichtbar (Polling gegen das Backend).
- Das Mikrofon (und die Sprachausgabe) ist nur im **ersten** Tab aktiv. Alle weiteren Tabs im selben Browser sind
  reine Anzeige. Schließt der erste Tab, übernimmt ein anderer.
- Die AI entscheidet per **RAG**, welche Seite mit welchen Daten angezeigt wird.
- Session-Daten liegen in **S3** (`S3_SESSION_PATH`).

## Ist-Stand (Ausgangslage)

Backend: `GET /replication/start` (Header `session-id`) existiert, liefert aber nur `module`; nichts schreibt je eine
Session. `Backend/src/Infrastructure/Start/ReplicationStorage/S3/S3Storage.ts` hat zwei Fehler: `Body?.toString()`
liefert `[object Object]` (muss `transformToString()` sein) und jeder S3-Fehler wird zu „neue Session“ verschluckt.
`GptUseCase` ist zustandslos; der Gesprächsverlauf liegt im Frontend (`Infrastructure/Conversation/Memory.ts`).

Frontend: `ReplicationPollHandler` pollt (1 s) `StartReplicationEntity`, die `SessionId` liegt nur im Speicher
(`uuid`-Paket), Module/Verlauf werden lokal gehalten, Mikrofon-Logik kennt keine anderen Tabs.

## Architektur

```
 Tab 1 (Leader: Mikrofon + Audio)        Tab 2..n (nur Anzeige)
   |  POST /gpt  (session-id)              |  GET /replication/start?version=N (Poll, 1 s)
   v                                       v
 API Gateway -> Lambda: GptController / StartReplicationController
                  |  1. Session laden + User-Text anhängen, busy=true  (S3, bedingtes Schreiben)
                  |  2. RAG: Query-Embedding -> Top-k Wissens-Chunks   (S3-Index, im Speicher gecacht)
                  |  3. GPT: Antwort + Seitenentscheidung (Modul + Dokument-IDs)
                  |  4. Entscheidung validieren, Session speichern, busy=false, version+1
                  v
              S3: <S3_SESSION_PATH><sessionId>.json      S3: <S3_KNOWLEDGE_PATH>index.json
```

### Session-Daten (S3-Objekt `<S3_SESSION_PATH><sessionId>.json`)

```json
{
  "version": 12,
  "updatedAt": "2026-10-07T14:48:00.000Z",
  "module": "CONVERSATION",
  "language": "de-DE",
  "busy": false,
  "busySince": null,
  "conversations": [{"role": "assistant", "text": "…", "language": "de-DE"}],
  "documents": [{"id": "about-endre#0", "title": "…", "text": "…", "url": null}]
}
```

- `module`: `START_SCREEN | CONVERSATION | OLD_PAGE | INFO` (neu: `INFO` = Seite, die `documents` darstellt).
- `documents` sind die Seitendaten der aktuellen Seite. Sie stammen **immer aus dem RAG-Index**, nie als Freitext von
  der AI (die AI liefert nur IDs; das Backend löst sie auf und verwirft unbekannte IDs).
- Verlauf: max. 50 Einträge gespeichert, max. 20 gehen an GPT.
- `version` wird bei jedem Schreiben um 1 erhöht. Konkurrierende Schreiber (zwei Tabs, zwei Lambdas) werden über
  S3-Conditional-Writes (`IfMatch` ETag / `IfNoneMatch: *`) mit begrenztem Retry serialisiert.
- `busy` wird vor dem GPT-Aufruf gesetzt und danach gelöscht, damit alle Tabs „denkt…“ zeigen. Ein `busy` älter als
  60 s (`busySince`) gilt als verwaist. Ein zweiter `POST /gpt` bei frischem `busy` → `409`.
- Lebensdauer: S3-Lifecycle-Regel auf den Session-Prefix (Parameter `SessionRetentionDays`, Standard 30).
- Datenschutz: Der Scene-Prompt behauptet bisher „Auf dem Server werden keine Nutzereingaben gespeichert“. Das stimmt
  nicht mehr und muss geändert werden (Hinweis auf zeitlich begrenzte Session-Speicherung). Die `session-id` ist ein
  Bearer-Geheimnis: nicht loggen (aktuell loggt `GptController` das komplette `event`), Format strikt als UUID v4
  validieren (S3-Key-Injection verhindern), sonst `400`.

### API-Vertrag

`GET /replication/start?version=<n>` – Header `session-id` (fehlt → `401`, ungültig → `400`)

- Unbekannte Session → `200` mit leerem Default (`version: 0`, `START_SCREEN`), es wird **nichts** geschrieben.
- `version` gleich der gespeicherten → `204` ohne Body. Sonst `200` mit dem Session-Objekt oben ohne `updatedAt`,
  `busySince`; `busy` ist ein Boolean.

`POST /gpt` – Header `session-id` (Pflicht für Replikation)

- Body wie bisher `{"messages": [{role, content, language}]}`. Mit `session-id` zählt nur die **letzte** Nachricht (der
  Verlauf kommt aus der Session). Ohne User-Nachricht (Start-Aufruf, `role: assistant`) wird die Begrüßung erzeugt.
- Antwort wie bisher (`commands`, `say`, `role`, `language`, `audio`, `data`), zusätzlich `module` und `version`.

CORS: `session-id` ist bereits in `Access-Control-Allow-Headers`. Neue Umgebungsvariable `S3_KNOWLEDGE_PATH`.

### RAG

- Wissensbasis: Markdown-Dateien unter `Backend/knowledge/` mit Frontmatter (`id`, `title`, `module`, `url?`), eine
  Datei = ein oder mehrere Chunks (Split an Überschriften). Pflicht-Dokumente: Startseite, alte Homepage 2020
  (`OLD_PAGE`, `url`), Endre Bock, Bock Laboratories, Technik der Seite.
- `npm run knowledge:index` (Script im Backend) erzeugt Embeddings (`text-embedding-3-small`) und lädt
  `<S3_KNOWLEDGE_PATH>index.json` nach S3. Kein Vektor-DB-Dienst: Korpus ist klein, Kosinus-Ähnlichkeit im Speicher.
- Laufzeit: Query = letzte User-Äußerung (+ letzte Assistenten-Antwort). Top-k (4) mit Mindest-Score. Der Index wird
  pro Lambda-Container gecacht (Revalidierung per ETag, max. alle 5 min).
- Die Treffer und der Seitenkatalog (`module` + Beschreibung) gehen als System-Kontext an GPT. GPT liefert zusätzlich
  `"page": {"module": "...", "documentIds": ["..."]}`. Das Backend akzeptiert nur Module aus dem Katalog und nur IDs,
  die im Index existieren; sonst bleibt der bisherige Zustand. Die alten Befehle bleiben:
  `openOldPage → OLD_PAGE`, `shutdown → START_SCREEN` (Verlauf leeren), `suspend → Modul unverändert`.

### Frontend

- `SessionStorage` (Core-Interface existiert) bekommt eine `localStorage`-Implementierung (Key `itbock.sessionId`);
  `SessionService` nutzt `crypto.randomUUID()` statt des `uuid`-Pakets (Paket entfernen).
- `ReplicationClient` sendet `?version=` und behandelt `204` als „unverändert“. `StartReplicationEntity` wird um
  `version`, `language`, `busy`, `conversations`, `documents` erweitert; Cache = Quelle für Ansicht.
- Gesprächsverlauf, Sprache und Ladezustand kommen aus der Replikation, nicht mehr aus
  `ConversationStorage`/`StartStorage` im Speicher. `Network`-GptClient sendet `session-id` und nur die neue
  Nachricht. Nach jedem POST sofort einmal pollen.
- Neue Ansicht `INFO` zeigt `documents` (Titel, Text, optionaler Link). Texte der Oberfläche laufen weiter über i18n.
- Mikrofon-Leader: Web Locks API (`navigator.locks.request('itbock.microphone', …)`). Wer die Lock hält, ist Leader:
  nur er nimmt auf, spielt Audio ab und darf Mikrofon-Aktionen auslösen. Follower haben `microphoneMuted = true`, kein
  Audio und zeigen auf der Startseite einen Hinweis statt des Start-Knopfs. Beim Schließen des Leaders rückt ein
  wartender Tab nach (Mikrofon startet dort wieder, wenn das Modul `CONVERSATION` ist). Ohne Web-Locks-Support gilt der
  Tab als Leader (Degradierung wie heute). Kein `BroadcastChannel` nötig – das Polling deckt „alle Tabs“ ab.

## Offene Punkte / Risiken

- Browser-Autoplay: Ein nachrückender Leader darf Audio ggf. erst nach einer Nutzergeste abspielen → dann Hinweis
  zeigen, Mikrofon trotzdem aktivieren.
- Polling-Kosten: 1 Request/s je Tab; `204` ohne S3-Body-Lesen ist nicht möglich (Version steht im Objekt), daher
  ein `GetObject` je Poll. Bei Bedarf Poll-Intervall im Hintergrund-Tab (`document.hidden`) erhöhen.
- Tests: Das Test-Setup (`node:test` + `tsx`, `npm test`, Tests unter `Backend/test` bzw. `Frontend/test` als
  `*.test.ts`) ist bereits eingerichtet und verifiziert. Ports (S3, OpenAI, fetch, Locks) werden gefaked.

## Umsetzungsplan mit Sub-Agents

Alle Agents sind `general-purpose` mit dem aktuellen Modell (kein Modellwechsel). Gemeinsame Regeln für jeden Agent:
`.github/instructions/*` lesen (4 Spaces, max. 120 Zeichen, Typen überall, `Array<T>`, Konstruktor-Injection mit
`private`, keine Kommentare außer wo nötig), **keine Git-Commits/Branches/Pushes**, keine `.env` lesen, Tests für
Neues (Happy Path), nur eigene Dateien anfassen (Container/Lambda/Template gehören dem Integrations-Agent).

| Welle | Agent | Auftrag | Schreibt nur in |
|-------|-------|---------|-----------------|
| 1 | **A – Backend-Session** | Session-Entity, Parser/Encoder, S3-Storage (Bugfixes, Conditional Writes, UUID-Validierung), `SessionUseCase` (`update`, busy), `StartReplicationController` (`version`, `204`) | `Backend/src/Core/Start`, `Backend/src/Infrastructure/Start`, `Backend/src/Application/Replication`, `Backend/test` |
| 1 | **B – Backend-RAG** | `Core/Rag` (Retriever, Ports), OpenAI-Embeddings, S3-Index-Store mit Cache, Index-Script, Wissensdokumente | `Backend/src/Core/Rag`, `Backend/src/Infrastructure/Rag`, `Backend/scripts`, `Backend/knowledge`, `Backend/test` |
| 1 | **D – Frontend-Replikation** | `localStorage`-Session, `randomUUID`, Replikationsclient/-entity, Verlauf/Sprache/Busy aus Replikation, GPT-Client mit `session-id`, `INFO`-Ansicht, `uuid` entfernen | `Frontend/**` (außer Leader-Dateien) |
| 2 | **C – Backend-Integration** | `GptUseCase` mit Session + RAG + Seitenentscheidung/Validierung, Scene-Prompt (Datenschutz, `page`), `GptController` (`session-id`, `409`, kein Loggen), Container/Lambda, `template.yaml` (Lifecycle, `S3_KNOWLEDGE_PATH`, IAM), `swagger.yaml`, `.env.dist`, Backend-README | `Backend/**` (nach A+B) |
| 2 | **F – Frontend-Leader** | Web-Locks-Leader, Mikrofon/Audio nur im Leader, Follower-Hinweis (i18n), Nachrücken | `Frontend/**` (nach D) |
| 3 | **R – Review** | `code-review` + `rubber-duck` über das Gesamt-Diff (Nebenläufigkeit, Sicherheit, Vertrag Frontend↔Backend) | read-only |

Welle 1 läuft parallel (disjunkte Dateien), Welle 2 parallel (Backend vs. Frontend), danach Review und Fixes.
Abnahme: `npm run build:tsc` + `npm test` im Backend, `npx tsc --noEmit` + `npm test` + `npm run build` im Frontend,
README (Wurzel + Backend) aktualisiert.
