## Gestione Voli API

Questo progetto offre un servizio API per la gestione dei voli e dei biglietti, consentendo agli utenti di ottenere informazioni sui voli disponibili e sui dettagli dei biglietti.

### Prerequisiti

- Go 
- Docker
- Docker Compose

### Configurazione

Modifica il file .env con le tue configurazioni (se necessario).

```
POSTGRES_USER=pg
POSTGRES_PASSWORD=pass
POSTGRES_DB=airline
```

## Utilizzo

 Avvia il server:
```
go run main.go
```

## API Endpoint

Il server espone degli endpoint per ottenere i voli.

Metodo | Endpoint | Descrizione
---|---|---
GET | getFlights?departure=AAA&arrival=BBB&departureDate=2023-12-25 | Ottiene le informazioni sui biglietti per la specifica data
GET | getTickets?id=2 | Ottiene le informazioni sul singolo biglietto


I parametri della richiesta GET `getFlights` sono:
- `departure`: partenza
- `arrival`: arrivo
- `departureDate`: data

I parametri della richiesta GET `getTickets` sono:
- `id`: id biglietto


## Esempio

Ecco un esempio delle richieste GET:

```http
GET http://localhost:8085/getTickets?id=2
```

La risposta sarà simile a:

```
{
  "id":	2
  "details": "Dettagli del secondo biglietto"
}
```

```http
GET http://localhost:8085/getFlights?departure=AAA&arrival=BBB&departureDate=2023-12-25
```

La risposta sarà simile a:

```
[
  {
    "id": 1,
    "departureCode": "AAA",
    "departureTime": "2023-12-25T08:00:00Z",
    "arrivalTime": "2023-12-25T10:00:00Z",
    "arrivalCode": "BBB",
    "expDate": "2023-12-20T08:00:00Z",
    "airlineName": "Sample Airlines",
    "price": 250
  }
]
```


inserisci un volo:

```bash
 curl -X POST \        
  http://localhost:8085/flights \
  -H 'Content-Type: application/json' \
  -d '{
  "departureCode": "JFK",
  "departureTime": "2024-03-17T08:00:00Z",
  "arrivalTime": "2024-03-17T12:00:00Z",
  "arrivalCode": "LAX",
  "expDate": "2024-03-16T23:59:59Z",
  "airlineName": "ACME Airlines",
  "price": 250.00
}'
```
