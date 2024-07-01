import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = 3000;
const FE_HOST = 'http://localhost:8087';

app.use(bodyParser.json());
app.use(cors());

let offersData: Record<string, any> = {};

// Endpoint per l'acquisto di un'offerta
app.get('/:paymentCode', async (req: Request, res: Response) => {
  const paymentCode = req.params.paymentCode;

  if (!offersData[paymentCode]) {
    res.status(404).json({ error: 'Offerta non trovata' });
    return;
  }

  res.status(200).json(offersData[paymentCode]);
});

// Endpoint per l'acquisto di un'offerta
app.post('/buy/:paymentCode', async (req: Request, res: Response) => {
  const paymentCode = req.params.paymentCode;
  const paymentData = req.body;

  if (!offersData[paymentCode]) {
    res.status(404).json({ error: 'Offerta non trovata' });
    return;
  }

  if (paymentData.amount !== offersData[paymentCode].amount) {
    res.status(400).json({ error: 'Importo non corretto' });
    await fetch(`http://acmesky_backend:3000/paymentResult`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( offersData[paymentCode] ),
    });
    return;
  }
  
  offersData[paymentCode]['payed'] = true;
  await fetch(`http://acmesky_backend:3000/paymentResult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( offersData[paymentCode] ),
  });
  delete offersData[paymentCode];

  res.status(200).json({ message: 'Acquisto effettuato correttamente' });
})

// Endpoint per la creazione dell'URL di pagamento
app.post('/createPaymentUrl', async (req: Request, res: Response) => {
  const paymentData = req.body;

  const paymentCode = crypto.randomBytes(20).toString('hex');
  
  paymentData['payment_code'] = paymentCode;
  offersData[paymentCode] = paymentData;

  const paymentUrl = `${FE_HOST}/${paymentCode}`;

  res.status(200).json({ paymentUrl });
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

