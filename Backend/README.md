# MFA-Backend

Backend für itbock.de: MFA-Tokens (TOTP), GPT-Chat, Audio-Transkription, Übersetzung (i18n) und Replikation. Es ist
in TypeScript geschrieben und läuft auf AWS Lambda hinter API Gateway. Das Deployment erfolgt direkt über AWS
CloudFormation (ohne Serverless Framework).

## Voraussetzungen

- Node.js (empfohlen: v24.x, entspricht der Lambda-Runtime `nodejs24.x`)
- npm (Node Package Manager)
- AWS CLI v2 mit konfigurierten Zugangsdaten (`aws configure`, Region `eu-west-1`)

## Installation

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

1. TypeScript Compiler-Konfiguration anpassen (optional):

   ```bash
   npx tsc --init
   ```

## Konfiguration

Die Infrastruktur (Lambda-Funktionen, IAM-Rolle, Log-Gruppen, API Gateway) ist in `template.yaml` (AWS
CloudFormation) beschrieben.

### Umgebungsvariablen

Alle Variablen stehen in `.env` (Vorlage: `.env.dist`, wird nicht committet). Werte aus `.env` haben Vorrang vor
bereits gesetzten Shell-/Windows-Variablen gleichen Namens.

Laufzeit (werden an die Lambda-Funktionen weitergegeben):

- `OPENAI_API_KEY`: OpenAI API-Key. Projekt- und Service-Account-Keys (`sk-proj-…`, `sk-svcacct-…`) werden
  unterstützt. Ein `OpenAI-Organization`-Header wird bewusst nicht gesendet, da dieser bei den neuen projektbasierten
  Keys zu `401`-Fehlern führt.
- `S3_BUCKET_NAME`: Bucket für Tokens, Nutzerdaten und Sessions.
- `S3_TOKEN_PATH`, `S3_USER_DATA_PATH`, `S3_SESSION_PATH`: Ablageorte (Prefixe) im Bucket.
- `S3_KNOWLEDGE_PATH`: Prefix des RAG-Indexes im Bucket, z.B. `Backend/Knowledge/`.

Deployment (nur für `npm run deploy`):

- `DEPLOY_ARTIFACT_BUCKET`: S3-Bucket für den hochgeladenen Code (Pflicht).
- `STACK_NAME` (Standard `itbock-backend`), `STAGE_NAME` (Standard `dev`).
- `DOMAIN_NAME` (Standard `api.itbock.de`): Custom Domain, die auf die API zeigt. Leer lassen = nicht umstellen.

## Replikation, Sessions und RAG

- `POST /gpt` akzeptiert optional den Header `session-id` (UUID v4). Mit Session-ID wird der Gesprächsverlauf in S3
  gespeichert und via `GET /replication/start?version=<n>` repliziert.
- Sessions enthalten Modul, Sprache, Busy-Status, Verlauf und Dokumente. Die KI liefert nur Dokument-IDs; das Backend
  löst sie aus dem Wissensindex auf und verwirft unbekannte IDs.
- Wissensdokumente liegen unter `Backend/knowledge/`. Vor jedem Deployment mit geändertem Wissen muss der Index neu
  gebaut und hochgeladen werden:

  ```bash
  npm run knowledge:index
  ```

- Datenschutz: Sitzungen werden für bis zu 30 Tage in Amazon S3 gespeichert und sind an eine zufällige Browser-
  Session-ID gebunden. IP-Adressen werden weder gespeichert noch an OpenAI weitergegeben.

## Projektstruktur

- `Application`: Delivery-Schicht, die Lambda-Controller (Mfa, Gpt, Audio, I18n, Replication).
- `Core`: Geschäftslogik und Interfaces, z.B. der `MfaService` und die GPT-Use-Cases.
- `Infrastructure`: Implementierungen der Schnittstellen, z.B. OpenAI (Chat, Audio), S3-Speicher und Krypto.
- `DependencyInjection`: `Container.ts` verdrahtet alles. `lambda.ts` exportiert die Handler.
- `scripts`: Build (`build.js`), Deployment (`deploy.js`) und lokaler Server (`local-server.js`).
- `template.yaml`: CloudFormation-Template der gesamten AWS-Infrastruktur.

## Lokales Testen

Ein kleiner lokaler Server (`scripts/local-server.js`) baut nichts selbst, sondern ruft die kompilierten Lambda-Handler
auf. `npm run start` kompiliert daher zuerst und startet dann den Server unter `http://localhost:3000/dev/...`.
Er nutzt die Werte aus `.env` und die lokalen AWS-Zugangsdaten (also echte S3-Daten und den echten OpenAI-Key):

```bash
npm run start
```

## Deployment

Voraussetzung: `DEPLOY_ARTIFACT_BUCKET` ist in `.env` gesetzt. Die Custom Domain `api.itbock.de` und das
ACM-Zertifikat `*.itbock.de` müssen in der Region bereits existieren (sie liegen außerhalb des Stacks). Dann:

```bash
npm run knowledge:index
npm run deploy
```

Das Skript `scripts/deploy.js` erledigt alles in einem Lauf:

1. Code bauen und per `aws cloudformation package` hochladen
2. Stack per `aws cloudformation deploy` ausrollen (`STACK_NAME`, Standard `itbock-backend`)
3. Neue API-Gateway-Deployment-Version für die Stage erstellen (`STAGE_NAME`, Standard `dev`)
4. **Scharf schalten:** die Custom Domain (`DOMAIN_NAME`, Standard `api.itbock.de`) wird auf diese API und Stage
   umgestellt. Mit `DOMAIN_NAME=` (leer) wird dieser Schritt übersprungen.

Ist die Domain bereits auf die API gemappt, wird sie nicht angefasst. Spätere Deployments sind damit ebenfalls nur
`npm run deploy`.

### Einmalige Lifecycle-Regel für Sessions

Der Stack verwendet einen bereits existierenden S3-Bucket. Deshalb wird die Lifecycle-Regel für Session-Dateien nicht
im Template angelegt. Die AWS-API ersetzt mit `put-bucket-lifecycle-configuration` immer die komplette Konfiguration.
Vorhandene Regeln müssen daher mit der folgenden Session-Regel zusammengeführt werden:

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket <S3_BUCKET_NAME> \
  --lifecycle-configuration file://session-lifecycle.json
```

```json
{
  "Rules": [
    {
      "ID": "itbock-session-retention",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "Backend/Session/"
      },
      "Expiration": {
        "Days": 30
      }
    }
  ]
}
```

Wird ein anderer Session-Prefix oder eine andere Aufbewahrungszeit verwendet, müssen `Prefix` bzw. `Days`
entsprechend angepasst werden.

### API-Key rotieren

Neuen Key in `.env` bei `OPENAI_API_KEY` eintragen und `npm run deploy` ausführen. Der Key wird als
CloudFormation-Parameter (`NoEcho`) an alle Lambda-Funktionen übergeben. Den alten Key erst nach einem Test von
`POST /gpt` bei OpenAI widerrufen.

### Rollback

Es gibt keinen zweiten Stack im Hintergrund. Für einen Rollback den vorherigen Code-Stand auschecken und erneut
`npm run deploy` ausführen.

## Lizenz

Dieses Projekt ist lizenziert unter der MIT-Lizenz.
