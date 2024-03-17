"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
// import { protectRoute } from './middlewares';
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Configura le route per la registrazione e il login
app.post('/register', auth_1.registerUser);
app.post('/login', auth_1.loginUser);
app.get('/getUser', user_1.getUser);
app.get('/getUser/:userId/interests', user_1.getUserInterests);
app.post('/createUserInterest', user_1.createUserInterest);
// // Rotte protette
// app.get('/offer', protectRoute, (req, res) => {
//   res.json({ message: 'route not found' });
// });
//
// app.get('/findTrip', protectRoute, (req, res) => {
//   res.json({ message: 'route not found' });
// });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
