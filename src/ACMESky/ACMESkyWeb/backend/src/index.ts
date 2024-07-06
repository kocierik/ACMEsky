import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { registerUser, loginUser } from './routes/auth';
import { createUserInterest, getUserInterests } from './routes/user_interest';
import { newFlight } from './routes/flight'
import { buyOffer, paymentResult } from './routes/offer';
import { authenticateJWT } from './middlewares';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(cookieParser());

app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/getUser/:userId/interests', getUserInterests);
app.post('/createUserInterest', authenticateJWT, createUserInterest);
app.post('/buyOffer', authenticateJWT, buyOffer);

// Called by bank service
app.post('/paymentResult', paymentResult);

// Call by flight companies
app.post('/newFlight', newFlight);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

