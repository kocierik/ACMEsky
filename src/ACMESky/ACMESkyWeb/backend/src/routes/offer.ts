import { Request, Response } from 'express';
import { send_string_as_correlate_message } from '../utils/camunda_rest_client';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const buyOffer = async (req: AuthenticatedRequest, res: Response) => {
  const { userId, offerCode, address } = req.body as { userId: string; offerCode: string; address: string };
  const { user } = req;

  if (!user) {
    return res.status(403).json({ error: 'Utente non autorizzato' });
  }

  if (user.userId !== userId) {
    return res.status(403).json({ error: 'ID utente non corrisponde' });
  }

  // Send message with the activationCode and the address to Camunda
  const response = await send_string_as_correlate_message("offer_purchase_data", [["offer_purchase_data", JSON.stringify({ offerCode, address, userId })]]);

  if (response.status >= 300) {
    console.error(`Fail to send message to Camunda. Response: ${await response.text()}`)
    return res.status(response.status).json({ error: 'Errore durante l\'acquisto dell\'offerta' });
  }

  return res.status(200).json({ message: 'Acquisto offerta inoltrato a Camunda' });
}

const paymentResult = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(403).json({ error: 'Utente non autorizzato' });
  }

  // Send message with the payment result to Camunda
  const response = await send_string_as_correlate_message("payment_status", [["payment_status", JSON.stringify(req.body)]], req.body.process_instance_id);

  if (response.status >= 300) {
    console.error(`Fail to send message to Camunda. Response: ${await response.text()}`)
    return res.status(response.status).json({ error: 'Errore durante la ricezione del risultato del pagamento' });
  }

  return res.status(200).json({ message: 'Risultati del pagamento inoltrati a Camunda' });
}

export { buyOffer, paymentResult };
