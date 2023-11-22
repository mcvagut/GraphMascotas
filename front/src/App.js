import './App.css';
import '../src/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import RegisterOrg from './pages/RegisterOrg/RegisterOrg.jsx';
import PetDetail from './pages/PetDetail/PetDetail.jsx';
import HomeOrg from './pages/Home/HomeOrg.jsx';


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/registro" element={<Register/>} />
          <Route path="/pets/:mascotaId" element={<PetDetail />} />
          <Route path="/registroOrg" element={<RegisterOrg/>} />
          <Route path="/homeOrg" element={<HomeOrg/>} />
        </Routes>
    </BrowserRouter>
    
  );
}

export default App;
