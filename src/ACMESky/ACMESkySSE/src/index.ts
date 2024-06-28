import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type'],
}));

let clients: Response[] = [];

// Middleware per aggiungere header CORS a tutte le risposte
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type');
  next();
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

function sendEvent(eventName: string, message: any) {
  clients.forEach(client => {
    client.write(`event: ${eventName}\n`);
    client.write(`data: ${JSON.stringify(message)}\n\n`);
  });
}

app.post('/send-flightInfos', (req, res) => {
  const message = req.body;
  sendEvent('flightInfos', message);
  res.status(200).send('flightInfos event sent');
});

app.post('/send-errors', (req, res) => {
  const message = req.body;
  sendEvent('errors', message);
  res.status(200).send('errors event sent');
});

app.post('/send-paymentURL', (req, res) => {
  const message = req.body;
  sendEvent('paymentURL', message);
  res.status(200).send('paymentURL event sent');
});

app.post('/send-tickets', (req, res) => {
  const message = req.body;
  sendEvent('tickets', message);
  res.status(200).send('tickets event sent');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`SSE server running on port ${PORT}`);
});
