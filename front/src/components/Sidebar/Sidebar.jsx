import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    <nav className=" bg-purple w-64 h-full p-4 text-white ">
      <h1 className="text-2xl font-extrabold mb-8">Adopción de Mascotas</h1>
      
      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
        <Link to="/">Organizaciones/Albergues</Link>
      </button>
      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
        <Link to="/">Solicitudes de Adopción</Link>
      </button>
      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
        <Link to="/">Seguimiento de Adopción</Link>
      </button>
      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
        <Link to="/">Historial de Adopción</Link>
      </button>
      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
        <Link to="/">Favoritos</Link>
      </button>
      <button
      onClick={handleLogout}
      className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300"
    >
      Cerrar Sesión
    </button>
      <Toaster />
    </nav>
  );
};

export default Sidebar;
