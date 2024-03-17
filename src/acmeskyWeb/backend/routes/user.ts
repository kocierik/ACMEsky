import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from "../utils/db"

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface User {
  id: number;
  email: string;
}

const getUser = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication header not found' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;

    try {
      const result = await pool.query<User>('SELECT id, email FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

interface UserInterest {
  id: number;
  user_id: number;
  departure_location: string;
  arrival_location: string;
  departure_date: Date;
  arrival_date: Date;
  max_price: number;
}

// Funzione per ottenere gli interessi di un utente
async function getUserInterests(req: Request, res: Response) {
  const userId = req.params.userId;

  try {
    const result = await pool.query<UserInterest>('SELECT * FROM user_interests WHERE user_id = $1', [userId]);
    const userInterests = result.rows;
    res.status(200).json(userInterests);
  } catch (error) {
    console.error('Errore durante il recupero degli interessi dell\'utente:', error);
    res.status(500).json({ error: 'Errore durante il recupero degli interessi dell\'utente' });
  }
}

const createUserInterest = async (req: Request, res: Response) => {
  const { user_id, departureLocation, arrivalLocation, departureDate, arrivalDate, maxPrice } = req.body;






  try {
    const result = await pool.query(
      'INSERT INTO user_interests (user_id, departure_location, arrival_location, departure_date, arrival_date, max_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, departureLocation, arrivalLocation, departureDate, arrivalDate, maxPrice]
    );

    const newUserInterest = result.rows[0];
    res.status(201).json(newUserInterest);
  } catch (error) {
    console.error('Error creating user interest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getUser, getUserInterests, createUserInterest };
