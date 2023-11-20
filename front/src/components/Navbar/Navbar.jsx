import React, { useState } from 'react';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-purple2 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-extrabold tracking-wider">
          <img className="w-20 h-20 custom-margin-left" src='https://th.bing.com/th/id/OIG.y11hK2O_HSD9zpkbThlu?w=1024&h=1024&rs=1&pid=ImgDetMain' alt='Logo Mascota'/>
        </div>

        {/* Botón de hamburguesa */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className="h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {/* ... (icono de cierre de hamburguesa) */}
            </svg>
          ) : (
            <svg
              className="h-8 w-8 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {/* ... (icono de hamburguesa) */}
            </svg>
          )}
        </button>

        {/* Menú de navegación */}
        <ul className={`lg:flex lg:space-x-4 mt-4 lg:mt-0 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-8 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            Inicio
          </li>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-4 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            Acerca de
          </li>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-4 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            Servicios
          </li>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-4 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            Contacto
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
