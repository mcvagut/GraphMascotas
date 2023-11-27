import React from 'react'
import Navbar from "../../components/Navbar/Navbar";
import Sidebar2 from "../../components/Sidebar/Sidebar2";
import Footer from "../../components/Footer/Footer";
import { useAuth } from '../../context/AuthContexto';
import PetCard2 from '../../components/PetCard/PetCard2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client'
import {toast, Toaster} from 'react-hot-toast';
import { useRef } from 'react';




const HomeOrg = () => {
  const { getOrganizationId } = useAuth();
  const organizationId = getOrganizationId();
  const [pets, setPets] = useState([])

  const [categorias, setCategorias] = useState([]);
  const [, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8800');
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Socket conectado');
      newSocket.emit('prueba', 'Hola desde el frontend');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket desconectado');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      console.log('Socket cerrado');
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('notificacion', (data) => {
        console.log('Notificación recibida en HomeOrg:', data);
        toast.success(`¡Atención! ${data.usuario} ha solicitado adoptar la mascota ${data.mascotaId}.`);
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
    const fetchPets = async () => {
      try {
        // Hacer la solicitud al backend para obtener las mascotas en adopción
        const response = await fetch(`http://localhost:8800/api/pets/mascotas/${organizationId}`);
        const petsData = await response.json(); 
       
        setPets(petsData);
      } catch (error) {
        console.error('Error al obtener las mascotas:', error);
      }
    };
    fetchPets();
  }, [organizationId]);

  return (
    <div className="flex flex-col h-screen">
    <Navbar/>
    <div className="flex flex-1 overflow-hidden">
        <Sidebar2 />
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
  {categorias.map((categoria) => (
    <div key={categoria.categoriaId} className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{categoria.tipo}</h2>
      <div className="flex flex-wrap justify-center">
        {pets
          .filter((mascota) => mascota.categoria === categoria.tipo)
          .map((mascota) => (
            <PetCard2 key={mascota.mascotaId} mascota={mascota} />
          ))}
      </div>
    </div>
  ))}
</main>

    </main>
    <Toaster />
    </div>
      <Footer />
  </div>
  )
}

export default HomeOrg