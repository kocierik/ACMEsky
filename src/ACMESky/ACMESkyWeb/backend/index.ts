import express from 'express';
import dotenv from 'dotenv';
import { registerUser, loginUser } from './routes/auth';
import cors from 'cors';
import { createUserInterest, getUser, getUserInterests } from './routes/user';
import { checkOfferAvailability } from './routes/offer';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/getUser', getUser);
app.get('/checkoffert/:offerCode', checkOfferAvailability);
app.get('/getUser/:userId/interests', getUserInterests);
app.post('/createUserInterest', createUserInterest);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

