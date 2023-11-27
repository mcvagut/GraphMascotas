import React, { useState } from "react";
import { MenuIcon } from "@heroicons/react/outline";
import "./navbar.css";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-purple2 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-extrabold tracking-wider">
          <img
            className="w-20 h-20 custom-margin-left"
            src="https://th.bing.com/th/id/OIG.y11hK2O_HSD9zpkbThlu?w=1024&h=1024&rs=1&pid=ImgDetMain"
            alt="Logo Mascota"
          />
        </div>

        {/* Botón de hamburguesa */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
        <ul
          className={`lg:flex lg:space-x-4 mt-4 lg:mt-0 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-8 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            <a
              href="/"
              className="block py-2 px-8 rounded-md bg-purple-500 hover:bg-purple text-white text-center text-xl font-bold tracking-wider"
            >
              Inicio
            </a>
          </li>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-4 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            <a
              href="/"
              className="block py-2 px-4 rounded-md bg-purple-500 hover:bg-purple text-white text-center text-xl font-bold tracking-wider"
            >
              Acerca de
            </a>
          </li>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-4 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            <a
              href="/"
              className="block py-2 px-4 rounded-md bg-purple-500 hover:bg-purple text-white text-center text-xl font-bold tracking-wider"
            >
              Servicios
            </a>
          </li>
          <li className="text-white text-2xl font-bold tracking-wider py-2 px-4 rounded-md bg-purple-500 hover:bg-purple cursor-pointer">
            <a
              href="/"
              className="block py-2 px-4 rounded-md bg-purple-500 hover:bg-purple text-white text-center text-xl font-bold tracking-wider"
            >
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
