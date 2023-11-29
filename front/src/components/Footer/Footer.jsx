import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const Footer = () => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <footer
      className={`bg-purple2 p-12 text-white relative overflow-hidden ${
        isExpanded ? "h-auto animate__animated animate__slideInUp" : "h-16 animate__animated animate__slideOutDown" 
      }`}
    >
      <div className="container mx-auto">
        {/* Contenido que siempre se muestra */}
        <div
          className={`mb-4 ${
            isExpanded ? "hidden" : "block"
          } flex items-center justify-center h-full`}
          style={{ fontFamily: 'Agbalumo, sans-serif' }}
        >
          <p className="text-2xl font-bold">UN LUGAR PARA DAR UNA NUEVA OPORTUNIDAD</p>
        </div>

        {/* Contenido adicional que se muestra al expandir el footer */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${
            isExpanded ? "block opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-4"
          } transition-all duration-500`}
        >
          <div>
            <h2 className="text-2xl font-extrabold mb-4">Contáctame</h2>
            <p className="text-lg">Dirección: La Paz, Bolivia</p>
            <p className="text-lg">Correo Electrónico: mcvagut@gmail.com</p>
            <p className="text-lg">Teléfono: (+591) 72516557</p>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold mb-4">
              Síguenos en Redes Sociales
            </h2>
            <div className="flex space-x-4">
              <a href="facebook.com" className="text-lg hover:text-gray-300">
                Facebook
              </a>
              <a href="twitter.com" className="text-lg hover:text-gray-300">
                Twitter
              </a>
              <a href="instagram.com" className="text-lg hover:text-gray-300">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Botón para expandir/reducir el footer */}
        <button
          onClick={() => setExpanded(!isExpanded)}
          className="text-5xl mt-0 focus:outline-none absolute bottom-14 left-1/2 transform -translate-x-1/2"
          style={{ color: "white" }} // Cambiar el color a rojo (#ff0000), ajusta según sea necesario
        >
          {isExpanded ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
