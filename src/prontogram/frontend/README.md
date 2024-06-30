## Prontogram

#### Panoramica
ProntoGram è un'applicazione web progettata per recuperare e visualizzare offerte specifiche per gli utenti in base al loro UUID. Questo servizio si integra con i profili utente di ACMEsky per recuperare offerte associate a un determinato UUID.

#### Funzionalità
- **Inserimento UUID**: Gli utenti possono inserire il loro UUID ottenuto dal profilo del loro account ACMEsky.
- **Recupero Offerte**: Dopo aver inserito l'UUID e cliccato su "Cerca Offerte", l'applicazione recupera le offerte specifiche di quell'UUID dall'API di ProntoGram.
- **Visualizzazione Offerte**: Le offerte recuperate sono mostrate in un formato a griglia responsive, mostrando dettagli come il codice di attivazione e i messaggi associati a ciascuna offerta.
- **Stato di Attivazione**: Ogni scheda offerta indica se è attualmente attiva con un badge verde.

![Home](https://kocierik.github.io/ACMEsky/src/prontogram/frontend/image/prontogram.png)

A questo punto è possibile recuperare il codice di offerta ed inserirlo nel sito web di ACMEsky per procedere con l'acquisto.