
# Coreografie

Le seguenti coreografie modellano tutti quanti i possibili processi che possono avvenire nel sistema che verrà implementato.  
Le interazioni che non comprendono *ACMESky* come mittente o destinatario sono molto semplificate, in quanto esterne ad essa e di cui non possiamo conoscere l'implementazione interna.
Verranno utilizzate le seguenti sigle per i ruoli delle coreografie:
- AS: ACMESky;
- CA*i*: Compagnie Aerea *i*, con *i* &isin; {1..N};
- CT*j*: Compagnie Trasporto *j*, con *j* &isin; {1..M};
- PG: ProntoGram;
- PP: Provider dei Pagamenti;
- DG: servizio per il calcolo delle Distanze Geografiche;
- UT*k*: UTente (il range in cui *k* varia dipende dagli utenti che attualmente hanno registrato interessi presso ACMESky).
### Registrazione interesse di un utente
RegistrazioneInteresseUtente ::= (reg: UTk -> AS; reg_res: AS -> UTk)
Le interazioni hanno il seguente significato:
- **reg**: registrazione dell'interesse di un utente per un viaggio;
- **reg_res**: risposta all'interazione **reg** (conferma o smentita della registrazione).
### Verifica giornaliera delle offerte
```
VerificaGiornaliera ::=
(
     ( control: AS -> CA1 ; control_res: CA1 -> AS ) | 
     ... |
     ( control: AS -> CAN ; control_res: CAN -> AS )
) ;
(
     ( ( notify: AS -> PG ; message: PG -> UT1 ) + 1 ) |
     ... |
     ( ( notify: AS -> PG ; message: PG -> UTN ) + 1 ) 
)
```
Le interazioni hanno il seguente significato:
- **control**: controllo giornaliero della presenza di offerte da parte della *compagnia aerea*;
- **control_res**: risposta all'interazione **control** (inoltro delle nuove offerte disponibili);
- **notify**: notifica della presenza di voli di interesse per l'utente tramite *ProntoGram* (possono esserci come no, se non ci sono l'utente non viene contattato). Il codice offerta inviato è univoco per offerta: se ci sono più utenti con gli stessi interessi viene inviato lo stesso codice offerta;
- **message**: *ProntoGram* riferisce il messaggio all'utente (essendo un servizio esterno questa è una semplificazione).
### Ricezione offerte last minute
```
NotificaVoliLastMinute ::=
( last_minute: CAi -> AS ) ;
(  
     ( ( notify: AS -> PG ; message: PG -> UT1 ) + 1 ) |
     ... |
     ( ( notify: AS -> PG ; message: PG -> UTN ) + 1 ) 
)
```
Le interazioni hanno il seguente significato:
- **last_minute**: la *compagnia aerea* notifica *ACMESky* della presenza di alcune offerte last minute, inviandogliele;
- **notify**: notifica della presenza di voli di interesse per l'utente tramite *ProntoGram* (possono esserci come no, se non ci sono l'utente non viene contattato). Il codice offerta inviato è univoco per offerta: se ci sono più utenti con gli stessi interessi viene inviato lo stesso codice offerta;
- **message**: *ProntoGram* riferisce il messaggio all'utente (essendo un servizio esterno questa è una semplificazione).
### Acquisto offerta da un utente
```
AcquistoOfferta ::=  
( ins_code: UTk -> AS ; ins_code_res: AS -> UTk) ;  
(  
    ( req_pay: AS -> PP ; req_pay_res: PP -> AS ;  send_payment_ref: AS -> UTk ; pay_offer: UTk -> PP ; ( pay_offer_res PP -> UTk | send_payment_status: PP -> AS ) ) ;
    ( 
    	( buy_flights: AS -> CAi ; buy_flights_res: CAi -> AS ) ;  
    	(
            (  
                 Calcolo distanza aeroporto/casa 
                ( calc_dist: AS -> DG ; calc_dist_res: DG -> AS ) ;  
                (
                     Calcolo distanze per identificare la compagnia di trasporto più vicina 
                     ( calc_dist: AS -> DG ; calc_dist_res: DG -> AS )* ;  
                     ( pren_trs: AS -> CTj ; pren_trs_res: CTj -> AS)
                ) 
                 + 1
            ) 
            + 1
        );    
        send_tickets: AS -> UTk 
    )   
     + payment_failure: AS -> UTk 
)
+ ins_code_failure: AS -> UTk
```
Le interazioni hanno il seguente significato:
- **ins_code**: l'utente inserisce il codice ricevuto via *ProntoGram* sul portale;
- **ins_code_res**: risposta all'interazione **ins_code** (conferma o smentita della ricezione del codice offerta);
- **req_pay**: *ACMESky* richiede il pagamento al *Provider dei Pagamenti*;
- **req_pay_res**: risposta all'interazione **req_pay** (inoltro riferimento per il pagamento dell'offerta);
- **send_payment_ref**: *ACMESky* invia all'utente il riferimento per poter pagare l'offerta tramite il *Provider dei Pagamenti*;
- **pay_offer**: l'utente invia i dati per il pagamento al *Provider dei Pagamenti*;
- **pay_offer_res**: risposta all'interazione **pay_offer** (invio esito del pagamento all'utente);
- **send_payment_status**: il *Provider dei Pagamenti* comunica ad *ACMESky* l'esito del pagamento;
- **buy_flights**: *ACMESky* compra per conto dell'utente il biglietto per i voli scelti presso la *compagnia aerea* CA*i* che fornisce entrambi i voli che soddisfano il bisogno;
- **buy_flights_res**: risposta all'interazione **buy_flights** (CA*i* conferma ad *ACMESky* la disponibilità del volo e inoltra il biglietto);
- **calc_dist**: *ACMESky* richiede il calcolo della distanza al servizio esterno per il calcolo delle *distanze geografiche*;
- **calc_dist_res**: risposta all'interazione **calc_dist**;
- **pren_trs**: in base alla distanza *ACMESky* può, oppure no, prenotare il trasporto;
- **pren_trs_res**: risposta all'interazione **pren_trs**;
- **send_tickets**: *ACMESky* invia all'utente i biglietti;
- **payment_failure**: *ACMESky* comunica all'utente che c'è stato un problema durante il pagamento;
- **ins_code_failure**: *ACMESky* comunica all'utente che il codice inserito non è valido.
## Verifica della connectedness delle coreografie
### Registrazione interesse di un utente
**RegistrazioneInteresseUtente** è connessa in quanto il ricevente in **reg** è uguale al mittente in **reg_res**.
### Verifica giornaliera delle offerte
In **VerificaGiornaliera**, la singola comunicazione fra AS e un qualsiasi CA*i* è connessa come per la precedente coreografia, in quanto il ricevente in **control** è uguale al mittente in **control_res**. Le interazioni parallele non hanno condizioni per poter verificare la connectedness e quindi non vengono verificate.  
Per quanto riguarda la composizione sequenziale fra la prima parte della coreografia, in cui avvengono le interazioni ( **control** ; **control_res** ) fra AS e le varie CA*i*, e la seconda parte, in cui avviene l'interazione dei **notify** fra AS e PG, è nuovamente assicurata la connectedness. Questo poiché ogni interazione all'interno della composizione parallela termina con ricevente AS e il mittente di ogni **notify** è AS.  
Dopo **notify** nella sequenza c'è **message** che invia il messaggio ad UT*k*. Essendo PG il ricevente di **notify** e il mittente di **message**, la sequenza è connessa. Nel caso in cui non avvenga **notify** fra AS e PG poiché non vi sono voli per l'utente da comunicare via ProntoGram, allora viene eseguito il ramo "1" (ovvero non viene fatto nulla). In questo caso, PG rimane in attesa di **notify** ma è corretto poiché è il suo compito.  
Come nell'interazione fra AS e le varie CA*i*, le interazioni parallele ( ( **notify** ; **message** ) + 1 ) non hanno condizioni per verificare la connectedness e quindi non viene verificata.
### Ricezione offerte last minute
**NotificaVoliLastMinute** è connessa in modo non dissimile a quanto avviene in **VerificaGiornaliera**. AS è ricevente in **last_minute** e mittente in **notify**, dopodiché PG è ricevente in **notify** e mittente in **message**. Da notare che **notify** e **message**, avvengono solamente se ci sono voli di interesse per l'utente e quindi nuovamente, in caso non ce ne siano, *ProntoGram* resterebbe in attesa ma non sarebbe un problema poiché è il suo compito. Come nella precedente coreografia, per le interazioni parallele ( ( **notify** ; **message** ) + 1 ) non può essere verificata la connectedness.
### Acquisto offerta da un utente
**AcquistoOfferta** è connessa perché:
- il ricevente di **ins_code** è il mittente di **ins_code_res** e di **ins_code_failure** (quest'ultimo termina la coreografia);
- il mittente di **ins_code_res** è lo stesso mittente di **req_pay**;
- il ricevente di **req_pay** è il mittente di **req_pay_res**;
- il ricevente di **req_pay_res** è il mittente di **send_payment_ref**;
- il ricevente di **send_payment_ref** è il mittente di **pay_offer**;
- il ricevente di **pay_offer** è sia il mittente di **pay_offer_res** che di **send_payment_status** e i due riceventi sono diversi (UTk in un caso, AS nell'altro);
- il ricevente di **send_payment_status** è il mittente di **buy_flights** e di **payment_failure** (quest'ultimo termina la coreografia);
- il ricevente di **buy_flights** è il mittente di **buy_flights_res**;
- il ricevente di **buy_flights_res** è il mittente di **calc_dist** e di **send_tickets** (quest'ultimo termina la coreografia);
- il ricevente di **calc_dist** è il mittente di **calc_dist_res** (nella sua prima invocazione);
- il ricevente di **calc_dist_res** è il mittente della seconda invocazione di **calc_dist** e di **send_tickets** (quest'ultimo termina la coreografia);
- il ricevente di **calc_dist** è il mittente di **calc_dist_res** nella prima parte della sequenza ( **calc_dist** ; **calc_dist_res** )* ;
- il ricevente di **calc_dist_res** è il mittente di **calc_dist** nella seconda parte della sopracitata sequenza, che quindi è connessa;
- il ricevente di **calc_dist_res** (l'ultimo della sequenza lunga almeno uno per ipotesi) è il mittente di **pren_trs**;
- il ricevente di **pren_trs** è il mittente di **pren_trs_res**;
- il ricevente di **pren_trs_res** è il mittente di **send_tickets** (quest'ultimo termina la coreografia).
## Proiezioni
Seguono le proiezioni delle coreografie, divise per ruolo.
### AS (ACMESky)
```
proj(RegistrazioneInteresseUtente, AS) =
( reg@UTk ; reg_res@UTk )
proj(VerificaGiornaliera, AS) = 
(
(control@CA1 ; control_res@CA1 ) |
... |
(control@CAN ; control_res@CAN )
) ;
(
    ( ( notify@PG ; 1 ) + 1 ) |
    ... |
    ( ( notify@PG ; 1 ) + 1 )
)
proj(NotificaVoliLastMinute, AS) =
( last_minute@CAi ) ;
(
    ( ( notify@PG ; 1 ) + 1 ) |
    ... |
    ( ( notify@PG ; 1 ) + 1 )
)
proj(AcquistoOfferta, AS) =
( ins_code@UTk ; ins_code_res@UTk) ;
(
( req_pay@PP ; req_pay_res@PP ; send_payment_ref@UTk ; 1 ; ( 1 | send_payment_status@PP ) ;
( 
	( buy_flights@CAi ; buy_flights_res@CAi ) ;
	(
		(
			( calc_dist@DG ; calc_dist_res@DG ) ;
			(
				( calc_dist@DG ; calc_dist_res@DG )*
				( pren_trs@CTj ; pren_trs_res@CTj )
			)
			+ 1
		)
		+ 1
	);
	send_tickets@UTk
)
+ payment_failure@UTk
)
+ ins_code_failure@UTk
```
### UTk (UTente)
```
proj(RegistrazioneInteresseUtente, UTk) =
( reg@AS ; reg_res@AS )
proj(VerificaGiornaliera, UTk) =
(
 ( 1 ; 1 ) |  
... | 
 ( 1 ; 1 )  
) ;  
(
     ( ( 1 ; 1 ) + 1 ) |
    ... |
     ( ( 1 ; message@PG ) + 1) |
    ... |
     ( ( 1 ; 1 ) + 1 )
)
= message@PG
proj(NotificaVoliLastMinute, UTk) =
( 1 ) ;
(
     ( ( 1 ; 1 ) + 1 ) |
    ... |
     ( ( 1 ; message@PG ) + 1) |
    ... |
     ( ( 1 ; 1 ) + 1 )
)
= message@PG
proj(AcquistoOfferta, UTk) =
( ins_code@AS ; ins_code_res@AS ) ;
(
( 1 ; 1 ; send_payment_ref@AS ; pay_offer@PP ; ( pay_offer_res@PP | 1 ) ) ;  
(
	 ( 1 ; 1 ) ;  
	(
		(
			( 1 ; 1 ) 
			 (
				( 1 ; 1 )*
				( 1 ; 1 ) 
			)
			+ 1
		)
		+ 1
	) ;
	send_tickets@AS
) 
+ payment_failure@AS
)
+ ins_code_failure@AS
= (  ins_code@AS ; ins_code_res@AS ) ; ( send_payment_ref@AS ; pay_offer@PP ; pay_offer_res@PP ) ;

```
### DG (Distanze Geografiche)

```
proj(RegistrazioneInteresseUtente, DG) =
( 1 ; 1 )
= 1
proj(VerificaGiornaliera, DG) =
(
(1 ; 1) |  
... |   
( 1 ; 1 )  
) ;
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= 1
proj(NotificaVoliLastMinute, DG) =
( 1 ) ;  
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= 1
proj(AcquistoOfferta, DG) =
( 1 ; 1 ) ;
(
( 1 ; 1 ; 1 ; 1 ; ( 1 | 1 ) ) ;  
(
	( 1 ; 1 ) ;  
	(
		(
			( calc_dist@AS ; calc_dist_res@AS ) ;  
			(
				( calc_dist@AS ; calc_dist_res@AS )*
				( 1 ; 1 )
			)
			+ 1
		)
		+ 1
	);  
	+ 1
)
+ 1
)
+ 1
= ( calc_dist@AS ; calc_dist_res@AS ) ; ( calc_dist@AS ; calc_dist_res@AS )* ) + 1
```

### PP (Provider dei Pagamenti)
```

proj(RegistrazioneInteresseUtente, PP) =
( 1 ; 1 )
= 1
proj(VerificaGiornaliera, PP) =
(
( 1 ; 1 ) |  
 ... |  
( 1 ; 1 )  
) ;  
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= 1
proj(NotificaVoliLastMinute, PP) =
( 1 ) ;  
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= 1
proj(AcquistoOfferta, PP) =
( 1 ; 1 ) ; 
(
( req_pay@AS ; req_pay_res@AS ; 1 ; pay_offer@UTk ; ( pay_offer_res@UTk | send_payment_status@AS ) ) ;  
(
	( 1 ; 1 ) ;  
	(
		(
			( 1 ; 1 ) ;  
			(
				( 1 ; 1 )*
				( 1 ; 1 )
			)
			+ 1
		)
		+ 1
	);  
	+ 1
)
+ 1
)
+ 1
= ( req_pay@AS ; req_pay_res@AS ; pay_offer@UTk ; ( pay_offer_res@UTk | send_payment_status@AS ) )
```

### PG (ProntoGram)
```
proj(RegistrazioneInteresseUtente, PG) =
( 1 ; 1 )
= 1
proj(VerificaGiornaliera, PG) =
(
    ( 1 ; 1 ) |
    ... |
    ( 1 ; 1 )
) ;
(
    ( ( notify@AS ; message@UT1 ) + 1 ) |
    ... |
    ( ( notify@AS ; message@UTN ) + 1 )
)
= ( ( notify@AS ; message@UT1 ) + 1 ) | ... | ( notify@AS ; message@UTk ) | ... | ( ( notify@AS ; message@UTN ) + 1 ) 
proj(NotificaVoliLastMinute, PG) =
( 1 ) ;
(
    ( ( notify@AS ; message@UT1 ) + 1 ) |
    ... |
    ( ( notify@AS ; message@UTN ) + 1 )
)
= ( ( notify@AS ; message@UT1 ) + 1 ) | ... | ( notify@AS ; message@UTk ) | ... | ( ( notify@AS ; message@UTN ) + 1 ) 
proj(AcquistoOfferta, PG) =
( 1 ; 1 ) ;
(
    ( 1 ; 1 ; 1 ; 1 ; ( 1 | 1 ) ) ;
    (
        ( 1 ; 1 ) ;
        (
            (
                ( 1 ; 1 ) ;
                (
                    ( 1 ; 1 )*
                    ( 1 ; 1 )
                )
                + 1
            )
            + 1
        );
        + 1
    )
    + 1
) 
+ 1
= 1
```

### CTj (Compagnia Trasporti)
```
proj(RegistrazioneInteresseUtente, CTj) =
( 1 ; 1 )
= 1
proj(VerificaGiornaliera, CTj) =
(
    ( 1 ; 1 ) |
    ... |
    ( 1 ; 1 ) 
) ;
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= 1
proj(NotificaVoliLastMinute, CTj) =
( 1 ) ;
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= 1
proj(AcquistoOfferta, CTj) =
( 1 ; 1 ) ; 
(
    ( 1 ; 1 ; 1 ; 1 ; ( 1 | 1 ) ;
    (
		( 1 ; 1 ) ;
        (
            (
                ( 1 ; 1 ) ;  
                (
                    ( 1 ; 1 )*
                    ( pren_trs@AS; pren_trs_res@AS )
                )
                + 1
            )
            + 1
        );
        + 1
    )
    + 1
)
+ 1
= ( pren_trs@AS; pren_trs_res@AS )
```

### CAi (Compagnia Aerea)
```
proj(RegistrazioneInteresseUtente, CAi) =
( 1 ; 1 )
= 1
proj(VerificaGiornaliera, CAi) =
(
    (1 ; 1) |
    ... |
    ( control@AS ; control_res@AS ) |  
    ... |
    ( 1 ; 1 )
) ; 
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= ( control@AS ; control_res@AS )
proj(NotificaVoliLastMinute, CAi) =
( last_minute@AS ) ;
(
    ( ( 1 ; 1 ) + 1 ) |
    ... |
    ( ( 1 ; 1 ) + 1 )
)
= last_minute@AS
proj(AcquistoOfferta, CAi) =
( 1 ; 1 ) ;
(
    ( 1 ; 1 ; 1 ; 1 ; ( 1 | 1  )) ;
    (
        ( buy_flights@AS ; buy_flights_res@CA ) ;
        (
            (
                ( 1 ; 1 ) ;
                (
                    ( 1 ; 1 )*
                    ( 1 ; 1 )
                )
                + 1
            )
            + 1
        );  
        + 1
    )
    + 1
)
+ 1
= ( buy_flights@AS ; buy_flights_res@CA )
```
