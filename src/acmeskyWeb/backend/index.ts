import express from 'express';
import dotenv from 'dotenv';
import { registerUser, loginUser } from './routes/auth';
import cors from 'cors';
import { createUserInterest, getUser, getUserInterests } from './routes/user';
// import { protectRoute } from './middlewares';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// Configura le route per la registrazione e il login
app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/getUser', getUser);
app.get('/getUser/:userId/interests', getUserInterests);
app.post('/createUserInterest', createUserInterest);

// // Rotte protette
// app.get('/offer', protectRoute, (req, res) => {
//   res.json({ message: 'route not found' });
// });
//
// app.get('/findTrip', protectRoute, (req, res) => {
//   res.json({ message: 'route not found' });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

