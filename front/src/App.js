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
import Favoritos from './pages/Favoritos/Favoritos.jsx';
import Solicitudes from './pages/SolicitudesAdopcion/Solicitudes.jsx';


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
        {/*Rutas Generales*/}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={ <Register/> } />
        <Route path="/registroOrg" element={ <RegisterOrg />} />

        {/* Rutas de usuario */}
        <Route path="/" element={<RutaPrivadaUsuario element={ <Home />} />} />
        <Route path="/pets/:mascotaId" element={<RutaPrivadaUsuario element={ <PetDetail />} />} />
        <Route path="/favoritos" element={<RutaPrivadaUsuario element={ <Favoritos />} />} />
        <Route path="/solicitudes" element={<RutaPrivadaUsuario element={<Solicitudes />} />} />

        {/* Rutas de organizaciones */}
        <Route path="/homeOrg" element={<RutaPrivadaOrganizacion element={<HomeOrg />} />} />
        <Route path="/pets2/:mascotaId" element={<RutaPrivadaOrganizacion element={<PetDetail2 />} />} />
        <Route path="/administrarSolicitud" element={<RutaPrivadaOrganizacion element={<AdministrarSolicitud />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
