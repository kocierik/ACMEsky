"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../utils/db"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
// Funzione per la registrazione di un nuovo utente
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            // Controlla se l'utente esiste già
            const userExists = yield db_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ error: 'Utente già registrato', status: 401 });
            }
            // Se l'utente non esiste già, procedi con la registrazione
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const result = yield db_1.default.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [
                email,
                hashedPassword,
            ]);
            const user = result.rows[0];
            // Genera il token JWT
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ message: 'Registrazione avvenuta con successo', id: user.id, token, status: 200 });
        }
        catch (error) {
            console.error('Errore durante la registrazione:', error);
            res.status(500).json({ error: 'Errore durante la registrazione', status: 500 });
        }
    });
}
exports.registerUser = registerUser;
// Funzione per il login di un utente esistente e generazione del token JWT
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const result = yield db_1.default.query('SELECT * FROM users WHERE email= $1', [email]);
            const user = result.rows[0];
            if (user) {
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (passwordMatch) {
                    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
                    res.status(200).json({ message: 'Accesso riuscito', token, id: user.id, status: 200 });
                }
                else {
                    res.status(401).json({ error: 'Credenziali non valide', status: 401 });
                }
            }
            else {
                res.status(401).json({ error: 'Credenziali non valide', status: 401 });
            }
        }
        catch (error) {
            console.error('Errore durante il login:', error);
            res.status(500).json({ error: 'Errore durante il login', status: 500 });
        }
    });
}
exports.loginUser = loginUser;
