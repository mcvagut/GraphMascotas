import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const Sidebar2 = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/users/logout");
      localStorage.removeItem("token");
      if (localStorage.getItem("token") === null) {
        console.log("Cierre de Sesión exitoso");
        toast.success("Cierre de Sesión exitoso");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error en el Cierre de Sesión:", error);
    }
  };
  return (
    <nav className="bg-purple w-64 h-full p-4 text-white flex flex-col items-center">
      <h1 className="text-2xl font-extrabold mb-8 text-center">
        Adopción de Mascotas
      </h1>
      <div className="flex flex-col items-center">

      <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg hover:font-bold dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
          <Link
            to="/homeOrg"
          >
            Inicio
          </Link>
        </button>
        <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg hover:font-bold dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
          <Link
            to="/"
          >
            Seguimiento de Mascotas Adoptadas
          </Link>
        </button>
        
        <button
        id='logoutOrg'
        onClick={handleLogout}
        className="block text-lg mb-2 p-2 hover:border hover:font-bold hover:rounded-lg dark:md:hover:bg-redfav focus:outline-none focus:text-gray-300"      >
        Cerrar Sesión
      </button>
      </div>

      {/* <button className="block text-lg mb-2 p-2 hover:border hover:rounded-lg dark:md:hover:bg-purple focus:outline-none focus:text-gray-300">
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
      </button> */}
  
      <Toaster />
    </nav>
  );
};

export default Sidebar2;
