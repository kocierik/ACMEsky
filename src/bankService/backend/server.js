const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'pg',
  password: process.env.POSTGRES_PASSWORD || 'pass',
  database: process.env.POSTGRES_DB || 'acmesky',
  host: process.env.POSTGRES_HOST || 'acmesky_db',
  port: 5432,
});

app.use(bodyParser.json());
app.use(cors());

let receivedData = null;

// Endpoint per gestire la richiesta POST di acquisto
app.post('/checkout/:offerCode', (req, res) => {
  const offerCode = req.params.offerCode;
  const data = req.body;

  // Salva i dati ricevuti nella variabile
  receivedData = data;
  // Rispondi al frontend per confermare che il checkout è stato completato con successo
  res.status(200).json({ success: true, message: 'Dati ricevuti con successo', offer: data, code: offerCode });
});

// Endpoint per ottenere i dati ricevuti per un'offerta specifica
app.get(`/received-data/:offerCode`, async (req, res) => {
  const offerCode = req.params.offerCode;

  try {
    const result = await pool.query(
      'SELECT * FROM offers WHERE codice_offerta = $1',
      [offerCode]
    );

    if (result.rowCount === 1) {
      const receivedOffer = result.rows[0];
      res.status(200).json(receivedOffer);
    } else {
      res.status(404).json({ success: false, message: 'Offerta non trovata' });
    }
  } catch (error) {
    console.error("Errore durante il recupero dei dati dell'offerta:", error);
    res.status(500).json({ success: false, message: 'Errore durante il recupero dei dati dell\'offerta' });
  }
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
