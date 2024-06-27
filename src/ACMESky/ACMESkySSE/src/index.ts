import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())


let clients: Response[] = [];

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

function sendEvent(message: Request) {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(message)}\n\n`);
    });
}

app.post('/send-message', (req, res) => {
    const message = req.body;
    sendEvent(message);
    res.status(200).send('Message sent');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('SSE server running on port 3000');
});