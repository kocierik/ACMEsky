const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

const app = express();
const PORT = 3001; // Puoi scegliere qualsiasi porta disponibile

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'pg',
  password: process.env.POSTGRES_PASSWORD || 'pass',
  database: process.env.POSTGRES_DB || 'acmesky',
  host: process.env.POSTGRES_HOST || 'postgres_back',
  port: 5432,
});

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
  console.log(receivedData)
  // Rispondi al frontend per confermare che il checkout è stato completato con successo
  res.status(200).json({ success: true, message: 'Dati ricevuti con successo', offer: data, code: offerCode });
});

// Endpoint per ottenere i dati ricevuti
app.get('/received-data', (req, res) => {
  // Restituisci i dati ricevuti al frontend
  res.status(200).json(receivedData);
});

// Endpoint per aggiornare lo stato disponibile dopo l'acquisto
app.post('/process-payment/:offerCode', async (req, res) => {
  const offerCode = req.params.offerCode;

  try {
    const result = await pool.query(
      'UPDATE offers SET disponibile = FALSE WHERE codice_offerta = $1 RETURNING *',
      [offerCode]
    );

    if (result.rowCount === 1) {
      const updatedOffer = result.rows[0];
      res.status(200).json({ success: true, message: 'Stato disponibile aggiornato con successo', offer: updatedOffer });
    } else {
      res.status(404).json({ success: false, message: 'Offerta non trovata' });
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento dello stato disponibile:", error);
    res.status(500).json({ success: false, message: 'Errore durante l\'aggiornamento dello stato disponibile' });
  }
});


// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
