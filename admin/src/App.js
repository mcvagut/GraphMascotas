import React from 'react';
import './App.css';
import '../src/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../src/Pages/Home/Home.jsx';
import Login from './Pages/Login/Login.jsx';
import Mascota from './Pages/Mascota/Mascota.jsx';
import Usuario from './Pages/Usuario/Usuario.jsx';
import Org from './Pages/Org/Org.jsx';
import { useAuth } from './context/AuthContexto.js';
import { Navigate} from 'react-router-dom';
import { jwtDecode as decode } from 'jwt-decode';

const RutaPrivadaAdmin = ({ element }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if(!decode(token).isAdmin){
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RutaPrivadaAdmin element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mascotas" element ={<RutaPrivadaAdmin element={<Mascota />} />} />
        <Route path="/usuarios" element ={<RutaPrivadaAdmin element={<Usuario />} />} />
        <Route path="/organizaciones" element ={<RutaPrivadaAdmin element={<Org />} />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
