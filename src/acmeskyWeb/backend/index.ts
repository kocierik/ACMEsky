import express from 'express';
import dotenv from 'dotenv';
import { registerUser, loginUser } from './routes/auth';
import cors from 'cors';
// import { protectRoute } from './middlewares'; // Importa la funzione di protezione della rotta

dotenv.config();

const app = express();
app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

app.use(cors())

// Configura le route per la registrazione e il login
app.post('/register', registerUser);
app.post('/login', loginUser);


// // Rotte protette
// app.get('/offer', protectRoute, (req, res) => {
//   res.json({ message: 'route not found' });
// });
//
// app.get('/findTrip', protectRoute, (req, res) => {
//   res.json({ message: 'route not found' });
// });

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

