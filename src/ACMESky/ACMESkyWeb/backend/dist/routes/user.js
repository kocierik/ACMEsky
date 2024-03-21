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
exports.createUserInterest = exports.getUserInterests = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../utils/db"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authentication header not found' });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const userId = decoded.userId;
        try {
            const result = yield db_1.default.query('SELECT id, email FROM users WHERE id = $1', [userId]);
            const user = result.rows[0];
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        }
        catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }));
});
exports.getUser = getUser;
// Funzione per ottenere gli interessi di un utente
function getUserInterests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        try {
            const result = yield db_1.default.query('SELECT * FROM user_interests WHERE user_id = $1', [userId]);
            const userInterests = result.rows;
            res.status(200).json(userInterests);
        }
        catch (error) {
            console.error('Errore durante il recupero degli interessi dell\'utente:', error);
            res.status(500).json({ error: 'Errore durante il recupero degli interessi dell\'utente' });
        }
    });
}
exports.getUserInterests = getUserInterests;
const createUserInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, departureLocation, arrivalLocation, departureDate, arrivalDate, maxPrice } = req.body;
    try {
        const result = yield db_1.default.query('INSERT INTO user_interests (user_id, departure_location, arrival_location, departure_date, arrival_date, max_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user_id, departureLocation, arrivalLocation, departureDate, arrivalDate, maxPrice]);
        const newUserInterest = result.rows[0];
        res.status(201).json(newUserInterest);
    }
    catch (error) {
        console.error('Error creating user interest:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createUserInterest = createUserInterest;
