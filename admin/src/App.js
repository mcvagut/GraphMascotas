import React from 'react';
import './App.css';
import '../src/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/Pages/Home/Home.jsx';
import Login from './Pages/Login/Login.jsx';
import Mascota from './Pages/Mascota/Mascota.jsx';
import Usuario from './Pages/Usuario/Usuario.jsx';
import Org from './Pages/Org/Org.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mascotas" element ={<Mascota />} />
        <Route path="/usuarios" element ={<Usuario />} />
        <Route path="/organizaciones" element ={<Org />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
