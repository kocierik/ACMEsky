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

## 4. Dati precaricati
Per poter testare il sistema è necessario caricare dei dati di esempio degli aeroporti e dei voli delle compagnie aeree.  
Il sistema ha già configurato una serie di dati di esempio visualizzabili nel file [init_sql.sh](https://github.com/kocierik/ACMEsky/tree/main/src/airlineService/data/init_sql.sh).

## 5. Accesso ai servizi
Se i punti precedenti sono stati seguiti correttamente e tutti i servizi sono attivi, è possibile accedere:

- ad ACMESky all'indirizzo [http://127.0.0.1:8080](http://127.0.0.1:8080);
- a ProntoGram all'indirizzo [http://127.0.0.1:8089](http://127.0.0.1:8089);
- alla dashboard di Camunda [http://127.0.0.1:10000/camunda/](http://127.0.0.1:10000/camunda/).