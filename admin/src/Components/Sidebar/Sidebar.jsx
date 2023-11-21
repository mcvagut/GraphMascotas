import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {

      await axios.post('http://localhost:8800/api/users/logout');
      localStorage.removeItem('token');
      if (localStorage.getItem('token') === null) {
        console.log('Cierre de Sesión exitoso');
        toast.success('Cierre de Sesión exitoso');
        navigate('/login');
      }
  
    } catch (error) {
      console.error('Error en el Cierre de Sesión:', error);
    }
  };
  return (
    <aside className="bg-black text-white font-bold w-64 min-h-screen flex flex-col">
    
    <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Sistema de Adopción de Mascotas</h2>
      </div>

      {/* Enlaces del Sidebar */}
      <nav className="flex-1 flex flex-col items-center justify-center">
        <ul className="space-y-7 w-full">
          <li>
            <button
              to="/admin/pets"
              className="w-full block p-3 text-lg hover:bg-greenP transition-colors duration-300"
            >
              Mascotas
            </button>
          </li>
          <li>
            <button
              to="/admin/organizations"
              className="w-full block p-3 text-lg hover:bg-greenP transition-colors duration-300"
            >
              Organizaciones
            </button>
          </li>
          <li>
            <button
              to="/admin/users"
              className="w-full block p-3 text-lg hover:bg-greenP transition-colors duration-300"
            >
              Usuarios
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full block p-3 text-lg hover:bg-greenP transition-colors duration-300"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
        <Toaster />
      </nav>
    </aside>
  );
};

export default Sidebar;
