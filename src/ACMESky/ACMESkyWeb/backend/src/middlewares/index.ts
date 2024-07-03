import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET || 'default_secret';

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


export { authenticateJWT };

