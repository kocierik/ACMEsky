import { Request, Response } from 'express';
import pool from "../utils/db";
import { Offer } from '../interfaces';

// Funzione per verificare se un'offerta è disponibile
const checkOfferAvailability = async (req: Request, res: Response) => {
  const activation_code = req.params.offerCode;

  try {
    // Query per controllare se l'offerta esiste e se è disponibile
    const result = await pool.query<Offer>('SELECT * FROM offers WHERE activation_code = $1', [activation_code]);
    const offer = result.rows[0];

    if (!offer) {
      return res.status(404).json({ error: 'Offerta non trovata' });
    }

    if (offer.payed) {
      return res.status(403).json({ error: 'Offerta già pagata' });
    }

    if (offer.created_at < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return res.status(403).json({ error: 'Offerta scaduta' });
    }

    // Offerta trovata e disponibile
    res.status(200).json({ message: 'Offerta disponibile', offer: offer });
  } catch (error) {
    console.error('Errore durante la verifica dell\'offerta:', error);
    res.status(500).json({ error: 'Errore durante la verifica dell\'offerta' });
  }
};

export { checkOfferAvailability };
