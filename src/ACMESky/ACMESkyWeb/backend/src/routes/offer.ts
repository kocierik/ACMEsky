import { Request, Response } from 'express';
import { send_string_as_correlate_message } from '../utils/camunda_rest_client';

// TODO: extract JWT from request through middleware
const buyOffer = async (req: Request, res: Response) => {
  const { userId, offerCode, address } = req.body as { userId: string; offerCode: string; address: string };

  // Send message with the activationCode and the address to Camunda
  const response = await send_string_as_correlate_message("offer_purchase_data", [["offer_purchase_data", JSON.stringify({ offerCode, address, userId })]]);

  if (response.status >= 300) {
    console.error(`Fail to send message to Camunda. Response: ${await response.text()}`)
    return res.status(response.status).json({ error: 'Errore durante l\'acquisto dell\'offerta' });
  }

  return res.status(200).json({ message: 'Acquisto offerta inoltrato a Camunda' });
}

const paymentResult = async (req: Request, res: Response) => {
  console.log(req.body)

  return res.status(200).json({ message: 'Acquisto offerta inoltrato a Camunda' });
}

export { buyOffer, paymentResult };
