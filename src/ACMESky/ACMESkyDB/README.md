# Database AcmeSky

## Introduzione
Panoramica dello schema del database per il progetto AcmeSky. 


## Tabelle

### `users`
- Questa tabella memorizza informazioni sugli utenti registrati.
  
| Colonna      | Tipo dati | Vincoli      | Descrizione                   |
|--------------|-----------|--------------|-------------------------------|
| id           | SERIAL    | PRIMARY KEY  | Identificatore univoco per un utente. |
| email        | VARCHAR   | NOT NULL     | Indirizzo email dell'utente.  |
| password     | VARCHAR   | NOT NULL     | Password dell'utente.         |

### `user_interests`
- Questa tabella registra gli interessi dell'utente nei voli.

| Colonna            | Tipo dati | Vincoli      | Descrizione                                |
|--------------------|-----------|--------------|--------------------------------------------|
| id                 | SERIAL    | PRIMARY KEY  | Identificatore univoco per un interesse utente.     |
| user_id            | INT       | NOT NULL     | Chiave esterna che fa riferimento alla tabella `users`. |
| departure_location | VARCHAR   | NOT NULL     | Luogo di partenza dell'interesse.            |
| arrival_location   | VARCHAR   | NOT NULL     | Luogo di arrivo dell'interesse.             |
| departure_date     | DATE      | NOT NULL     | Data di partenza dell'interesse.            |
| arrival_date       | DATE      | NOT NULL     | Data di arrivo dell'interesse.              |
| max_price          | DECIMAL   | NOT NULL     | Prezzo massimo disposto a pagare per il viaggio. |

### `offers`
- Questa tabella contiene informazioni sulle offerte di volo disponibili.

| Colonna            | Tipo dati | Vincoli      | Descrizione                                    |
|--------------------|-----------|--------------|------------------------------------------------|
| id                 | SERIAL    | PRIMARY KEY  | Identificatore univoco per un'offerta.         |
| codice_offerta     | VARCHAR   | NOT NULL     | Codice dell'offerta.                           |
| departure_location | VARCHAR   | NOT NULL     | Luogo di partenza del volo.                    |
| arrival_location   | VARCHAR   | NOT NULL     | Luogo di arrivo del volo.                      |
| departure_date     | DATE      | NOT NULL     | Data di partenza del volo.                     |
| arrival_date       | DATE      | NOT NULL     | Data di arrivo del volo.                       |
| price              | DECIMAL   | NOT NULL     | Prezzo dell'offerta di volo.                   |
| disponibile        | BOOLEAN   | NOT NULL     | Indica se l'offerta è disponibile (true) o meno (false). |

## Conclusione
Questo schema del database fornisce la struttura necessaria per gestire gli interessi degli utenti nei voli e memorizzare le offerte di volo nel progetto AcmeSky. Seguendo i passaggi di inizializzazione, è possibile configurare il database e iniziare a utilizzarlo per le esigenze del progetto.

