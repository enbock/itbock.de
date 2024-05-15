# MFA-Backend

Ein einfaches MFA-Backend, das TOTP-Tokens generiert und validiert. Dieses Projekt verwendet TypeScript und läuft auf
AWS Lambda. Es verwendet die Serverless Framework für einfaches Deployment.

## Voraussetzungen

- Node.js (empfohlen: v20.x)
- npm (Node Package Manager)
- Serverless Framework (`npm install -g serverless`)

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

Serverless Framework ist bereits konfiguriert, um die Lambda-Funktionen zu deployen. Die `serverless.yml` Datei enthält
die Konfiguration.

## Projektstruktur

- `Application`: Enthält die Delivery-Schicht, z.B. Handlers, Presenter und den Dependency Injection Container.
- `Core`: Enthält die Geschäftslogik, z.B. den `MFAService` und Interfaces für Abhängigkeiten.
- `Infrastructure`: Enthält Low-Level Implementierungen wie den `CryptoService` und den `InMemoryTokenStore`.

## Lokales Testen

Du kannst die Lambda-Funktionen lokal mit dem Serverless Framework testen:

```bash
serverless offline
```

## Deployment

Um das Service zu AWS zu deployen, benutze:

```bash
serverless deploy
```

Nach dem Deployment erhältst du eine URL, über die deine API-Endpunkte erreichbar sind.

## Lizenz

Dieses Projekt ist lizenziert unter der MIT-Lizenz.
