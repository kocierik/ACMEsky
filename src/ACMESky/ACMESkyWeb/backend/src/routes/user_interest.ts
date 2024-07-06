import { Request, Response } from 'express';
import dotenv from 'dotenv';
import pool from "../utils/db"
import { AuthRequest, UserInterest } from '../interfaces';
import { send_string_as_correlate_message } from '../utils/camunda_rest_client';

dotenv.config();

// Funzione per ottenere gli interessi di un utente
async function getUserInterests(req: AuthRequest, res: Response<UserInterest[] | { error: string }>) {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(403).json({ error: 'Utente non autorizzato' });
  }

  try {
    const result = await pool.query<UserInterest>('SELECT * FROM user_interests WHERE user_id = $1', [userId]);
    const userInterests = result.rows;
    res.status(200).json(userInterests);
  } catch (error) {
    console.error('Errore durante il recupero degli interessi dell\'utente:', error);
    res.status(500).json({ error: 'Errore durante il recupero degli interessi dell\'utente' });
  }
}

// Funzione per creare un nuovo interesse chiamando il servizio Camunda
async function createUserInterest(req: AuthRequest, res: Response<UserInterest | { error: string }>) {
  const user = req.user;
  if (!user || !user.userId) {
    return res.status(403).json({ error: 'Utente non autorizzato' });
  }
  
  const userInterest: UserInterest = {...req.body, user_id: user.userId, valid: true};

  // Send message with the interest to Camunda
  const response = await send_string_as_correlate_message("interest", [["interest", JSON.stringify(userInterest)]]);
  if (response.status >= 300) {
    console.error(`Fail to send message to Camunda. Response: ${await response.text()}`)
    return res.status(response.status).json({ error: 'Errore durante la creazione dell\'interesse' });
  }

  return res.status(response.status).json(userInterest);
}

export { getUserInterests, createUserInterest };
