import { Request, Response } from 'express';
import pool from "../utils/db";
import { Offer } from '../interfaces';
import { send_string_as_correlate_message } from '../utils/camunda_rest_client';

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

// TODO: extract JWT from request through middleware
const buyOffer = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const offerCode = req.params.offerCode;
  const address = req.body.address;

  // Send message with the activationCode and the address to Camunda
  const response = await send_string_as_correlate_message("offer_purchase_data", [["offer_purchase_data", JSON.stringify({ offerCode, address, userId })]]);

  if (response.status >= 300) {
    console.error(`Fail to send message to Camunda. Response: ${await response.text()}`)
    return res.status(response.status).json({ error: 'Errore durante l\'acquisto dell\'offerta' });
  }

  return res.status(200).json({ message: 'Acquisto offerta inoltrato a Camunda' });
}

export { checkOfferAvailability, buyOffer };
