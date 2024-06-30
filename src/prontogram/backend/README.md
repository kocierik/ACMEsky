# Prontogram Backend

Questa applicazione Jolie fornisce un semplice servizio Prontogram che consente di aggiungere e recuperare offerte tramite un'interfaccia HTTP RESTful. Il servizio ascolta su un socket specificato e gestisce le richieste HTTP per l'aggiunta di offerte e per ottenere offerte in base agli ID utente.

## interfacce

```
type AddOfferRequest: void {
    .user_id: string
    .activation_code: string
    .message: string
}

type Offer: void {
    .user_id: string
    .activation_code: string
    .message: string
}

type OfferList: void {
    .offers[0,*]: Offer
}

type UserId: void {
    .id: string
}

interface IProntogramService
{

    RequestResponse:
        addOffer(AddOfferRequest)(Offer),
        getOffers(UserId)(OfferList)
}
```

## API

1. **getOffers**
   - **Template:** `/api/offers`
   - **Metodo:** GET
   - **Formato:** JSON
   - **Codici di Stato:** 
     - 200: Successo
     - 400: Errore

2. **addOffer**
   - **Template:** `/api/offer`
   - **Metodo:** POST
   - **Formato:** JSON
   - **Codici di Stato:**
     - 200: Successo
     - 400: Errore

#### Configurazione CORS
Il servizio include intestazioni per il Cross-Origin Resource Sharing (CORS):
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: *`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: *`

## Inizializzazione
All'inizializzazione, vengono creati due oggetti globali:
- `global.users = {}`: Per la gestione degli utenti.
- `global.inbox = {}`: Per la gestione delle offerte.

## Funzionamento

### Aggiunta di un'Offerta
- Operazione: `addOffer(AddOfferRequest)(Offer)`
- L'offerta viene creata con i dati ricevuti e aggiunta alla `global.inbox`.
- L'offerta viene poi formattata in una stringa leggibile e stampata sulla console.

### Recupero delle Offerte
- Operazione: `getOffers(UserId)(OfferList)`
- Le offerte per l'ID utente specificato vengono recuperate dalla `global.inbox`.
- Le offerte vengono poi formattate in una stringa leggibile e stampate.
