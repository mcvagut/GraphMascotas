import React from 'react';
import './App.css';
import '../src/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/Pages/Home/Home.jsx';
import Login from './Pages/Login/Login.jsx';
import Mascota from './Pages/Mascota/Mascota.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mascotas" element ={<Mascota />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
