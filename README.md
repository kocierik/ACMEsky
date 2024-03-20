# ACMEsky

Progetto di Ingegneria del Software Orientata ai Servizi A.A. 2023/2024

Per lanciare tutti i servizi usare docker

```bash
docker compose up -d
```

## Definizione architettura (bozza)

1. ACMESky, diviso in:
    1. *Camunda Workers*:
        - Interroga quotidianamente compagnie aeree e verifica presenza di nuove offerte
        - Interroga il servizio di GeoDistance
        - Interroga il servizio di Rent
        - Richiede al Bank Service di generare un URL su cui l'utente può eseguire il pagamento
        - Invia il codice relativo all'offerta proposta al cliente su Prontogram
    2. *Camunda Engine*: prende in input i diagrammi BPMN e gestisce i workers
    3. *Backend*
        - Gestisce le richieste dal frontend
        - Riceve offert last-minute dal Airline Service
        - Riceve le conferme dei pagamenti dal Bank Service
        - Rispedisce eventuali richieste ai Camunda Workers
    4. *Frontend*
        - Fornisce all'utente un interfaccia per interagire con ACMESky
        - Autenticazione
        - Registrare interessi
        - Acquistare biglietti di un offerta ricevuta su Prontogram
    5. *Database*
        - Memorizza le richieste dell'utente
        - Memorizza offerte trovate e relativo codice Prontogram, da verificare il match in seguito
        - Memorizza transazioni dei pagamenti (completate e non)
    6. *Redis* (?)
2. *Airline Service*
    - Gestiscono i database di tutti i voli
    - Endpoint per ricevere le richieste giornaliere dal worker di ACMESky
    - Endpoint per aggiungere una offerta, che viene immediatamente notificata a ACMESky BE
3. *Bank Service*, si divide in:
    1. *Backend*
        - Rimane in ascolto per la creazione di un nuovo endpoint di pagamento
        - Notifica ACMESky BE per la conferma di un pagamento
    2. *Frontend*
        - Tramite URL personalizzati l'utente può accedere a una pagina di pagamentoi
4. *GeoDistance Service* (API Rest)
    - Interrogato da un Worker, ritorna la distanza geografica di due luoghi
5. *Rent Service* (Jolie SOAP)
    - Interrogato da un worker, DA CAPIRE => come comunicare all'utente? DB?
6. *Prontogram*, si divide in:
    1. *Backend* (Jolie Rest):
        - Rimane in ascolto da un worker dopo il match di offerte. Si salva il codice per relativo all'offerta da acquistare
    2. *Frontend*:
        - Permette all'utente di visualizzare tutti i codici relativi ai match di offerte

## Servizi implementati
- [x] **AcmeSky web**: Interfaccia grafica. manca la gestione delle offerte. che dipende dal servizio prontogram
    - I vari servizi di ACMESky vanno implementati come Camunda Workers. Un worker per ogni task dei diagrammi BPMN
- [x] **Airline Service**: Compagnia aerea. 
- [x] **Bank Service**: Gestore dei pagamenti.
- [ ] **Prontogram**: App  di messaggistica.
    - Backend: in ascolto da ACMESky worker service quando match di una richiesta di un cliente
    - Frontend
- [x] **GeoDistance Service**: Servizio per il calcolo delle distanze geografiche.
- [x] **Rent Service**: Servizio di noleggio con conducente.
