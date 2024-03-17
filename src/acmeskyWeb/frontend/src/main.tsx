import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import TripForm from './components/TripForm.tsx';
import OfferForm from './components/OfferForm.tsx';
import Profile from './components/Profile.tsx';
import { UserContext } from './context/userContext.ts'; 

interface IUserData {
  id?: number | null;
  email?: string | null;
}

const Root = () => {
  const [user, setUser] = useState<IUserData | null>({
    id: null,
    email: null
  });

  return (
    <React.StrictMode>
      {/* Utilizzo del provider del contesto per incapsulare la gerarchia dei componenti */}
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/offer" element={<OfferForm />} />
            <Route path="/findTrip" element={<TripForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
