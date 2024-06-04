import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { send_string_as_correlate_message } from '../utils/camunda_rest_client';
import { Flight, Offer } from '../interfaces';

dotenv.config();

async function newFlight(req: Request, res: Response<Offer | { error: string }>) {
  const flight: Flight = req.body;

  // Send message with the interest to Camunda
  const response = await send_string_as_correlate_message("offers", [["offers", JSON.stringify(flight)]]);
  if (response.status >= 300) {
    console.error(`Fail to send message to Camunda. Response: ${await response.text()}`)
    return res.status(response.status).json({ error: 'Errore durante la creazione dell\'offerta' });
  }
  
  const offer: Offer = JSON.parse(await response.text())
  return res.status(response.status).json(offer);
}

export { newFlight };
