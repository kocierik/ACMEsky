Il progetto è stato testato su macchine linux:
- Linux man 6.9.6-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux

Entrambi con Docker versione 27.0.3, build 7d4bcd863a.

## 1. Clonare il repository

```bash
git clone git@github.com:kocierik/ACMEsky.git
```

## 2. Creare i file di environment necessari
Per poter funzionare correttamente, alcuni servizi hanno bisogno che alcune variabili d'ambiente. Questi file contengono password, API KEY e URL.

## 3. Eseguire i servizi
Il file `docker-compose.yaml` contiene le indicazioni per docker-compose su come debbano essere avviati i diversi servizi.
Per eseguire tutti i servizi è sufficiente lanciare il comando:
```bash
docker-compose up -d
```
Per rimuovere tutti i servizi:

```bash
docker-compose down
```

## 4. Caricamento dei dati di esempio
Per poter testare il sistema è necessario caricare dei dati di esempio dei voli delle compagnie aeree.  
Il container del database delle compagnie aeree (`flight_companies_db`) ha già dei dataset precaricati, è sufficiente importarli all'interno delle tabelle dei database. Questo è possibile farlo mediante i seguenti tre (perché tre sono le compagnie aeree di esempio) comandi:

## 5. Accesso ai servizi
Se i punti precedenti sono stati seguiti correttamente e tutti i servizi sono attivi, è possibile accedere:

- ad ACMESky all'indirizzo [http://127.0.0.1:8080](http://127.0.0.1:8080);
- a ProntoGram all'indirizzo [http://127.0.0.1:8089](http://127.0.0.1:8089);
- alla dashboard di Camunda [http://127.0.0.1:10000/camunda/](http://127.0.0.1:10000/camunda/).