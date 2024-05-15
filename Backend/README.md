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

## Endpunkte und Verwendung

1. **Token generieren**

    - **URL**: `POST /generate-token`
    - **Body**:

      ```json
      {
        "userId": "user123"
      }
      ```

    - **Antwort**:
        - **200 OK**:

          ```json
          {
            "message": "Token generated",
            "token": "123456",
            "otpauth": "otpauth://totp/YourAppName:user123?secret=SECRET_KEY&issuer=YourAppName"
          }
          ```

        - **400 Bad Request**:

          ```json
          {
            "message": "User ID is required"
          }
          ```

2. **Token validieren**

    - **URL**: `POST /validate-token`
    - **Body**:

      ```json
      {
        "userId": "user123",
        "token": "123456"
      }
      ```

    - **Antwort**:
        - **200 OK**:

          ```json
          {
            "message": "Token is valid"
          }
          ```

        - **401 Unauthorized**:

          ```json
          {
            "message": "Invalid token"
          }
          ```

        - **400 Bad Request**:

          ```json
          {
            "message": "User ID and token are required"
          }
          ```

## Beitrag leisten

Beiträge sind willkommen! Bitte erstelle einen Pull-Request und beschreibe Änderungen.

## Lizenz

Dieses Projekt ist lizenziert unter der MIT-Lizenz.
