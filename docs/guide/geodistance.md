# GeoDistance

Questo programma in Go fornisce un servizio web per calcolare la distanza tra due punti geografici utilizzando la libreria `golang-geo` e il framework `gin-gonic`.

## Prerequisiti

1. Go deve essere installato nel tuo sistema. Puoi trovare le istruzioni di installazione [qui](https://golang.org/doc/install).
2. Le dipendenze esterne del progetto possono essere ottenute utilizzando `go mod`. Esegui il seguente comando nella directory del progetto:
```
go mod tidy
```

## Utilizzo

 Avvia il server:
```
go run main.go
```

## API Endpoint

Il server espone un singolo endpoint per calcolare la distanza tra due punti geografici.

Metodo | Endpoint | Descrizione
---|---|---
GET | /distance | Calcola la distanza tra due punti geografici.

I parametri della richiesta GET sono:
- `lat1`: Latitudine del primo punto
- `lon1`: Longitudine del primo punto
- `lat2`: Latitudine del secondo punto
- `lon2`: Longitudine del secondo punto

Il risultato viene restituito in formato JSON con il valore della distanza in chilometri.

## Esempio

Ecco un esempio di una richiesta GET:

```http
GET http://localhost:8080/distance?lat1=40.7128&lon1=-74.0060&lat2=34.0522&lon2=-118.2437
```

La risposta sarà simile a:

```
{
  "distance_km": 3934.308076389663
}
```

## Risorse
- Gin Web Framework
- Golang Geo Library


