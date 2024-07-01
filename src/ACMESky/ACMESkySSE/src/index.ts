import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8080', // Allow only the specified origin
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type'],
}));

let listeners: Record<string, Response> = {};

app.get('/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const token = req.cookies['token'];
  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }
  const data = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
  const userId = data.userId;

  listeners[userId] = res;

  req.on('close', () => {
    delete listeners[userId];
  });
});

function sendEvent(eventName: string, data: any) {
  if (!listeners[data['userId']]) {
    return;
  }
  listeners[data['userId']].write(`event: ${eventName}\n`);
  listeners[data['userId']].write(`data: ${JSON.stringify(data)}\n\n`);
}

app.post("/send/:event", (req: Request, res: Response) => {
  sendEvent(req.params.event, req.body);
  res.status(200).send(`${req.params.event} event sent`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSE server running on port ${PORT}`);
});
