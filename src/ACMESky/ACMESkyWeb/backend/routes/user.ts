import { Request, Response } from 'express';
import dotenv from 'dotenv';
import pool from "../utils/db"
import { UserInterest } from '../interfaces';

dotenv.config();

// Funzione per ottenere gli interessi di un utente
async function getUserInterests(req: Request, res: Response<UserInterest[] | { error: string }>) {
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

const createUserInterest = async (req: Request, res: Response<UserInterest | { error: string }>) => {
  const userInterest: UserInterest = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO user_interests (user_id, departure_location, arrival_location, from_date, to_date, max_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [...Object.values(userInterest)]
    );

    const newUserInterest = result.rows[0];
    res.status(201).json(newUserInterest);
  } catch (error) {
    console.error('Error creating user interest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getUserInterests, createUserInterest };
