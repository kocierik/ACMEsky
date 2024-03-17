"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = exports.errorMiddleware = exports.validateInputData = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware per la validazione dei dati in input
const validateInputData = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateInputData = validateInputData;
const errorMiddleware = (err, req, res, next) => {
    console.error('Errore:', err);
    res.status(500).json({ error: 'Errore interno del server' });
};
exports.errorMiddleware = errorMiddleware;
// Imposta le tue variabili di ambiente
const SECRET = process.env.JWT_SECRET || 'default_secret';
const STATUS_UNAUTHORIZED = 401;
// Middleware per verificare il token JWT
const protectRoute = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Estrai il token dal formato 'Bearer <token>'
        jsonwebtoken_1.default.verify(token, SECRET, (err, decoded) => {
            if (err) {
                return res.status(STATUS_UNAUTHORIZED).json({ error: `Errore durante la verifica del token: ${err.message}` });
            }
            else {
                // Verifica se l'utente ha i permessi necessari per accedere alla rotta offer
                if (decoded && decoded.userId) {
                    // Se l'utente ha i permessi, procedi alla rotta successiva
                    return next();
                }
                else {
                    // Se l'utente non ha i permessi, restituisci un errore di autorizzazione
                    return res.status(STATUS_UNAUTHORIZED).json({ error: 'Non sei autorizzato ad accedere a questa risorsa' });
                }
            }
        });
    }
    else {
        return res.status(STATUS_UNAUTHORIZED).json({ error: 'Intestazione di autenticazione non trovata' });
    }
};
exports.protectRoute = protectRoute;
