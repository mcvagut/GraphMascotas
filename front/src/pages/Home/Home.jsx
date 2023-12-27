import React, {useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Search from "../../components/Search/Search";
// import Sorting from "../../components/Sorting/Sorting";
import PetCard from "../../components/PetCard/PetCard";
import axios from "axios";
import io from 'socket.io-client';
import { useRef } from 'react';
import {toast, Toaster} from 'react-hot-toast';
import { useAuth } from "../../context/AuthContexto";



const Home = () => {

const [categorias, setCategorias] = useState([]);
const [estadoAdopcion, setEstadoAdopcion] = useState([]);
const [searchResults, setSearchResults] = useState([]);

const { usuario } = useAuth();
const us = usuario();

const [, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8800');
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Socket conectado');
      const userIdentificador = us.usuario;
      newSocket.emit('identificador', userIdentificador); 

    });

    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      console.log('Socket cerrado');
    };
  }, [us.usuario]);


  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('notificacion2', (data) => {
        console.log('Resultado de adopción recibido en HomeOrg:', data);
        toast[data.aceptar ? 'success' : 'error'](data.mensaje);
      });
    }
  }, []);



useEffect(() => {
  const obtenerDatos = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/categorias");

      const categoriasConMascotasPromises = response.data.map(async (categoria) => {
        const mascotasResponse = await axios.get(`http://localhost:8800/api/pets/categoria/${categoria.tipo}`);
        return {
          ...categoria,
          mascotas: mascotasResponse.data,
        };
      });

      const categoriasConMascotas = await Promise.all(categoriasConMascotasPromises);
      setCategorias(categoriasConMascotas);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  obtenerDatos();
}, []);


useEffect(() => {
  const obtenerEstados = async () => {
  try{
    const obtenerDatos = await axios.get("http://localhost:8800/api/pets/get/state")
    setEstadoAdopcion(obtenerDatos.data);
  }catch(error){
    console.error("Error al obtener datos:", error);
  }
  } 
  obtenerEstados();
},[]);



return (
  <div className="flex flex-col h-screen">
    <Navbar/>
    <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
      <Search onSearch={setSearchResults} />
      {/* <Sorting /> */}
      {searchResults.length > 0 ? (
        <div className="mb-8">
          {/* Renderizar las PetCard basadas en los resultados de búsqueda */}
          <div className="flex flex-wrap justify-center">
            {searchResults.map((mascota) => (
              <PetCard key={mascota.mascotaId} mascota={mascota} />
            ))}
          </div>
        </div>
      ) : (
        // Renderizar las categorías como antes si no hay resultados de búsqueda
        categorias.map((categoria) => (
          <div key={categoria.categoriaId} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{categoria.tipo}</h2>
            <div className="flex flex-wrap justify-center">
              {categoria.mascotas
                .filter((mascota) =>
                  estadoAdopcion.some(
                    (estado) => estado.mascotaId === mascota.mascotaId
                  )
                )
                .map((mascota) => (
                  <PetCard key={mascota.mascotaId} mascota={mascota} />
                ))}
            </div>
          </div>
        ))
      )}
    </main>
    </div>
      <Footer />
      <Toaster />
  </div>
);
};

export default Home;