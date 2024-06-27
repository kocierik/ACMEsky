import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';  // Import the UUID package
import pool from "../utils/db";
import { User } from '../interfaces';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Funzione per la registrazione di un nuovo utente
async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    // Controlla se l'utente esiste già
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Utente già registrato', status: 401});
    }

    // Se l'utente non esiste già, procedi con la registrazione
    const hashedPassword = await bcrypt.hash(password, 10);
    const userUuid = uuidv4();  // Generate a new UUID
    const result = await pool.query<User>('INSERT INTO users (email, password, uuid) VALUES ($1, $2, $3) RETURNING *', [
      email,
      hashedPassword,
      userUuid,
    ]);
    const user = result.rows[0];

    // Genera il token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Registrazione avvenuta con successo', id: user.id, uuid: user.uuid, token, status: 200});
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ error: 'Errore durante la registrazione', status: 500 });
  }
}

// Funzione per il login di un utente esistente e generazione del token JWT
async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const result = await pool.query<User>('SELECT * FROM users WHERE email= $1', [email]);
    const user = result.rows[0];
    
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Accesso riuscito', token, id: user.id, uuid: user.uuid, status: 200 });
        return;
      }
    }
    res.status(401).json({ error: 'Credenziali non valide', status: 401 });

  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ error: 'Errore durante il login', status: 500 });
  }
}

export { registerUser, loginUser };
