import React from 'react';
import { Link } from 'react-router-dom'; // Asumiendo que estás utilizando React Router

const Sidebar = () => {
  return (
    <nav className="bg-purple w-64 h-full p-4 text-white">
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
      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
        <Link to="/">Cerrar Sesión</Link>
      </button>
    </nav>
  );
};

export default Sidebar;
