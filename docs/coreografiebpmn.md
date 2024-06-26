
# Diagramma delle coreografie BPMN
In questa sezione vengono mostrate le coreografie BPMN che mostrano le interazioni tra i processi relativi ai diversi
partecipanti.

## Diagramma completo

![Coreografia completa](coreografie_bpmn/img/diagram_all.png)

Il diagramma è stato suddiviso in parti per poterle spiegare singolarmente.

## Salvataggio degli interessi

![Invio interesse](coreografie_bpmn/img/send_interest.png)

La coreografia descrive come l'utente e *ACMEsky* interagiscono nello scenario dell'invio degli interessi. L'utente manda una User Interest, mentre ACMEsky risponde con un messaggio di corretto inserimento o di errore.


## Ricerca dei voli di interesse

![Ricerca dei voli](coreografie_bpmn/img/search_flights.png)

La coreografia descrive l'interazione tra *ACMEsky* e *Airline Service* al fine di cercare i voli che hanno una corrispondenza con quelli richiesti dagli utenti. Ogni ora e per ciascuna *Airline Service* registrata al servizio, *ACMEsky* recupera i voli di interesse degli utenti  e effettua una richiesta all'*Airline Service* che restituisce la lista dei voli disponibili.


## Ricezione dei voli last-minute

![Ricezione voli last-minute](coreografie_bpmn/img/last_minute.png)

La coreografia descrive come *ACMEsky* e *Airline Service* interagiscono nello scenario della ricezione e salvataggio dei voli last-minute. *Airline Service* invia i voli last-minute ad ACMEsky che risponde con un messaggio di corretto inserimento o di errore.


## Generazione dell'offerta

![Generazione offerta](coreografie_bpmn/img/make_offer.png)

La coreografia mostra come *ACMEsky*, *Prontogram* e l'utente si relazionano al fine di notificare l'utente della corretta generazione dell'offerta. Ogni ora, se ci sono delle nuove offerte per l'utente, *ACMEsky* manda un messaggio a *Prontogram* che a sua volta risponde con un messaggio di corretto inserimento o di errore. Successivamente *Prontogram* manda una notifica all'utente.


## Conferma e acquisto dell'offerta

![Conferma e acquisto](coreografie_bpmn/img/confirm_pay_offer.png)

La coreografia descrive come l'utente, *ACMEsky*, *Bank Service*, *Airline Service*, *GeoDistance Service* e *Rent Service* interagiscono nel contesto della conferma e acquisto dell'offerta di volo da parte dell'utente. Quest'ultimo, conferma la volontà di voler acquistare l'offerta proposta inserendo il token ricevuto tramite l'app di Prontogram nel portale web di *ACMEsky*, il quale risponde con un messaggio di corretto inserimento o di errore. 

*ACMEsky* verifica che l'offerta sia ancora valida, se non lo è il flusso termina. Altrimenti, il processo continua fino alla sotto-coreografia, in cui l'utente passa il token dell'offerta ed il suo indirizzo per richiedere il pagamento, che deve svolgere entro cinque minuti (pena la fine del processo). 
*ACMEsky* recupera l'offerta corrispondente al token ed effettua una richiesta ad *Airline Service* che gli restituisce i biglietti. Se l'offerta è ancora disponibile per l'acquisto *ACMEsky* procede con il recupero del link del pagamento mandando un messaggio a *Bank Service* fornendo i dettagli dell'offerta. La banca restituirà ad *ACMEsky* il link che successivamente verrà inviato all'utente. 
Se l'utente non effettua il pagamento tramite il link fornitogli entro cinque minuti il processo termina.

Se il prezzo dell'offerta è superiore a 1000€, *ACMEsky* calcolerà la distanza tra l'indirizzo dell'utente e quello dell'aereoporto di partenza, inviando i rispettivi indirizzi al servizio per il calcolo delle distanze che restituirà la distanza tra i due punti.
Se questa è superiore ai 30Km, *ACMEsky* si servirà nuovamente di *GeoDistance Service* per trovare la compagnia di noleggio più vicina.
Infine, viene prenotato il trasporto per l'andata e per il ritono dall'areoporto attraverso la *Rent Service* individuata.


## Recupero del biglietto

![Recupero del biglietto](coreografie_bpmn/img/request_ticket.png)

La coreografia descrive come l'utente richiede ad *ACMEsky* il biglietto precedentemente acquistato. L'utente specifica il biglietto al quale è interessato inviando il codice dell'offerta. Successivamente *ACMEsky* recupera il biglietto corrispondente all'offerta in formato PDF.

&nbsp;
<div class="page-break"></div>

