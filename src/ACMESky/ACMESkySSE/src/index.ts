import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type'],
}));

let listeners: Record<string, Response> = {};

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

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  const data = jwt.verify(token, process.env.SECRET || 'default_secret') as { userId: string };
  const userId = data.userId;

  listeners[userId] = res;

  req.on('close', () => {
    delete listeners[userId];
  });
});

function sendEvent(eventName: string, message: any) {
  listeners[message['userId']].write(`event: ${eventName}\n`);
  listeners[message['userId']].write(`data: ${JSON.stringify(message)}\n\n`);
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
