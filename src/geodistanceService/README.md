### Servizio di geodistance

#### Panoramica
Questo servizio calcola la distanza tra due località utilizzando l'API Matrix delle Distanze. Esso espone un singolo endpoint `/distance` che accetta parametri di query per le località di origine e destinazione, restituendo la distanza nel formato JSON.

#### Utilizzo

2. Effettuare una richiesta:
   - Esempio di richiesta:
     ```
     GET http://localhost:8040/distance?origins=bologna&destinations=milano
     ```

#### Risposta
- Risposta di successo:
  ```json
  {
    "distance": "205"
  }
  ```

#### Note
- Il servizio gestisce le richieste GET per calcolare la distanza tra le località specificate.
