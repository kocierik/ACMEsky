const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001; // Puoi scegliere qualsiasi porta disponibile

// Middleware per il parsing del corpo della richiesta in formato JSON
app.use(bodyParser.json());
app.use(cors());

let receivedData = null; // Variabile per memorizzare i dati ricevuti

// Endpoint per gestire la richiesta POST di acquisto
app.post('/checkout/:offerCode', (req, res) => {
  const offerCode = req.params.offerCode;
  const data = req.body;

  // Salva i dati ricevuti nella variabile
  receivedData = data;

  // Rispondi al frontend per confermare che il checkout è stato completato con successo
  res.status(200).json({ success: true, message: 'Dati ricevuti con successo', offer: data, code: offerCode });
});

// Endpoint per ottenere i dati ricevuti
app.get('/received-data', (req, res) => {
  // Restituisci i dati ricevuti al frontend
  res.status(200).json(receivedData);
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
