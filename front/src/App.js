import './App.css';
import '../src/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import RegisterOrg from './pages/RegisterOrg/RegisterOrg.jsx';
import PetDetail from './pages/PetDetail/PetDetail.jsx';
import HomeOrg from './pages/Home/HomeOrg.jsx';
import PetDetail2 from './pages/PetDetail/PetDetail2.jsx';
import { useAuth } from './context/AuthContexto.js';
import { Navigate } from 'react-router-dom';
import { jwtDecode as decode } from 'jwt-decode';
import AdministrarSolicitud from './pages/AdministrarSolicitud/AdministrarSolicitud.jsx';


const RutaPrivadaUsuario = ({ element }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = decode(token);

  if (decodedToken.isOrganization) {
    
    return <Navigate to="/login" />;

  }

  return element;
};

const RutaPrivadaOrganizacion = ({ element }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = decode(token);

  if (!decodedToken.isOrganization) {
    return <Navigate to="/login" />;
  }

  return element;
};



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de usuario */}
        <Route path="/" element={<RutaPrivadaUsuario element={ <Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RutaPrivadaUsuario element={ <Register />} />} />
        <Route path="/pets/:mascotaId" element={<RutaPrivadaUsuario element={ <PetDetail />} />} />

        {/* Rutas de organizaciones */}
        <Route path="/registroOrg" element={<RutaPrivadaOrganizacion element={<RegisterOrg />} />} />
        <Route path="/homeOrg" element={<RutaPrivadaOrganizacion element={<HomeOrg />} />} />
        <Route path="/pets2/:mascotaId" element={<RutaPrivadaOrganizacion element={<PetDetail2 />} />} />
        <Route path="/administrarSolicitud" element={<RutaPrivadaOrganizacion element={<AdministrarSolicitud />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
