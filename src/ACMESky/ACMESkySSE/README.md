# SSE Server

Questo repository contiene un server Node.js per la gestione di eventi lato server (SSE - Server-Sent Events) utilizzando Express. Il server consente ai client di ricevere eventi in tempo reale autenticandosi con JWT (JSON Web Token).

## Endpoints

### GET /events

Questo endpoint consente ai client di connettersi per ricevere eventi SSE. Richiede che il client invii un cookie `token` contenente un JWT valido.

#### Esempio di Richiesta

```http
GET /events HTTP/1.1
Host: localhost:3000
Cookie: token=your_jwt_token
```

### POST /send/:event

Questo endpoint consente di inviare un evento specifico al client connesso.

#### Parametri

- `:event`: Il nome dell'evento da inviare.

#### Corpo della Richiesta

Il corpo della richiesta deve essere un JSON contenente i dati dell'evento, incluso `userId` per identificare il destinatario.

#### Esempio di Richiesta

```http
POST /send/sampleEvent HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "userId": "user123",
  "message": "flight example"
}
```

#### Esempio di Risposta

```http
HTTP/1.1 200 OK
Content-Type: text/plain

sampleEvent event sent
```

## Middleware

### CORS

Il server è configurato per consentire le richieste CORS solo dall'origine `http://localhost:8080`.

## Funzioni Principali

### Gestione degli Eventi

- `sendEvent(eventName: string, data: any)`: Invia un evento SSE al client specificato da `userId` presente nei dati dell'evento. Utile per l'invio delle offerte

### Gestione delle Connessioni

Le connessioni SSE sono memorizzate in un oggetto `listeners` dove la chiave è `userId` e il valore è l'oggetto `Response`.
