import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

// Middleware per la validazione dei dati in input
const validateInputData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Errore:', err);
  res.status(500).json({ error: 'Errore interno del server' });
};

// Imposta le tue variabili di ambiente
const SECRET = process.env.JWT_SECRET || 'default_secret';
const STATUS_UNAUTHORIZED = 401;

// Middleware per verificare il token JWT
const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Estrai il token dal formato 'Bearer <token>'

    jwt.verify(token, SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(STATUS_UNAUTHORIZED).json({ error: `Errore durante la verifica del token: ${err.message}` });
      } else {
        // Verifica se l'utente ha i permessi necessari per accedere alla rotta offer
        if (decoded && decoded.userId) {
          // Se l'utente ha i permessi, procedi alla rotta successiva
          return next();
        } else {
          // Se l'utente non ha i permessi, restituisci un errore di autorizzazione
          return res.status(STATUS_UNAUTHORIZED).json({ error: 'Non sei autorizzato ad accedere a questa risorsa' });
        }
      }
    });
  } else {
    return res.status(STATUS_UNAUTHORIZED).json({ error: 'Intestazione di autenticazione non trovata' });
  }
};




interface AuthenticatedRequest extends Request {
  user?: any; 
}

const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; 

  if (!token) {
    return res.status(401).json({ error: 'Token non fornito' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token non valido' });
  }
};


export { validateInputData, errorMiddleware, protectRoute, authenticateJWT };

