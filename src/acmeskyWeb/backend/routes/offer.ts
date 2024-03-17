import { Request, Response } from 'express';
import pool from "../utils/db";

interface Offer {
  id: number;
  codice_offerta: string;
  departure_location: string;
  arrival_location: string;
  departure_date: string; // Formato data come stringa (yyyy-mm-dd)
  arrival_date: string;   // Formato data come stringa (yyyy-mm-dd)
  price: number;          // Prezzo come numero decimale
  disponibile: boolean;
}

// Funzione per verificare se un'offerta è disponibile
const checkOfferAvailability = async (req: Request, res: Response) => {
  const codiceOfferta = req.params.codiceOfferta;

  try {
    // Query per controllare se l'offerta esiste e se è disponibile
    const result = await pool.query<Offer>('SELECT * FROM offers WHERE codice_offerta = $1', [codiceOfferta]);
    const offer = result.rows[0];

    if (!offer) {
      return res.status(404).json({ error: 'Offerta non trovata' });
    }

    if (!offer.disponibile) {
      return res.status(403).json({ error: 'Offerta non disponibile' });
    }

    // Offerta trovata e disponibile
    res.status(200).json({ message: 'Offerta disponibile', offer: offer });
  } catch (error) {
    console.error('Errore durante la verifica dell\'offerta:', error);
    res.status(500).json({ error: 'Errore durante la verifica dell\'offerta' });
  }
};

export { checkOfferAvailability };
