import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import TripForm from './components/TripForm.tsx';
import OfferForm from './components/OfferForm.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/offer" element={<OfferForm />} />
        <Route path="/findTrip" element={<TripForm />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode >,
)
