# MFA-Backend

Ein einfaches MFA-Backend, das TOTP-Tokens generiert und validiert. Dieses Projekt verwendet TypeScript und läuft auf
AWS Lambda. Das Deployment erfolgt direkt über AWS CloudFormation (ohne Serverless Framework).

## Voraussetzungen

- Node.js (empfohlen: v24.x, entspricht der Lambda-Runtime `nodejs24.x`)
- npm (Node Package Manager)
- AWS CLI v2 mit konfigurierten Zugangsdaten (`aws configure`)

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

Die benötigten Variablen stehen in `.env` (Vorlage: `.env.dist`):

- `OPENAI_API_KEY`: OpenAI API-Key. Projekt- und Service-Account-Keys (`sk-proj-…`, `sk-svcacct-…`) werden
  unterstützt. Ein `OpenAI-Organization`-Header wird bewusst nicht gesendet, da dieser bei den neuen projektbasierten
  Keys zu `401`-Fehlern führt.
- `S3_BUCKET_NAME`, `S3_TOKEN_PATH`, `S3_USER_DATA_PATH`, `S3_SESSION_PATH`: Ablageorte im S3-Bucket.

## Projektstruktur

- `Application`: Enthält die Delivery-Schicht, z.B. Handlers, Presenter und den Dependency Injection Container.
- `Core`: Enthält die Geschäftslogik, z.B. den `MFAService` und Interfaces für Abhängigkeiten.
- `Infrastructure`: Enthält Low-Level Implementierungen wie den `CryptoService` und den `InMemoryTokenStore`.

## Lokales Testen

Ein kleiner lokaler Server (`scripts/local-server.js`) ruft die gebauten Lambda-Handler auf und ist unter denselben
URLs wie bisher erreichbar (`http://localhost:3000/dev/...`):

```bash
npm run start
```

## Deployment

Einmalig in `.env` einen S3-Bucket für die Code-Artefakte angeben (`DEPLOY_ARTIFACT_BUCKET`, bewusst nicht der
Daten-Bucket). Danach:

```bash
npm run deploy
```

Das Skript `scripts/deploy.js` erledigt alles in einem Lauf:

1. Code bauen und per `aws cloudformation package` hochladen
2. Stack per `aws cloudformation deploy` ausrollen (`STACK_NAME`, Standard `itbock-backend`)
3. Neue API-Gateway-Deployment-Version für die Stage erstellen (`STAGE_NAME`, Standard `dev`)
4. **Scharf schalten:** die Custom Domain (`DOMAIN_NAME`, Standard `api.itbock.de`) wird auf diese API und Stage
   umgestellt. Mit `DOMAIN_NAME=` (leer) wird dieser Schritt übersprungen.

Ist die Domain bereits auf die API gemappt, passiert nichts. Die Domain und das ACM-Zertifikat selbst liegen außerhalb
des Stacks. Beim ersten Lauf gibt das Skript die vorherige REST-API-ID aus. Ein Rollback ist der Befehl:

```bash
aws apigateway update-base-path-mapping --domain-name api.itbock.de --base-path "(none)" \
  --patch-operations op=replace,path=/restapiId,value=<alteRestApiId>
```

## Lizenz

Dieses Projekt ist lizenziert unter der MIT-Lizenz.
