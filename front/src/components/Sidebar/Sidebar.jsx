import React from 'react';
import { Link } from 'react-router-dom'; // Asumiendo que estás utilizando React Router

const Sidebar = () => {
  return (
    <nav className="bg-purple w-64 h-full p-4 text-white">
      <h1 className="text-2xl font-extrabold mb-8">Adopción de Mascotas</h1>
      <ul>
        <li className="mb-4">
          <Link to="/" className="block text-lg hover:text-gray-300">Inicio</Link>
        </li>
        <li className="mb-4">
          <Link to="/adoptar" className="block text-lg hover:text-gray-300">Adoptar</Link>
        </li>
        <li className="mb-4">
          <Link to="/donar" className="block text-lg hover:text-gray-300">Donar</Link>
        </li>
        <li className="mb-4">
          <Link to="/voluntariado" className="block text-lg hover:text-gray-300">Voluntariado</Link>
        </li>
        <li className="mb-4">
          <Link to="/contacto" className="block text-lg hover:text-gray-300">Contacto</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
