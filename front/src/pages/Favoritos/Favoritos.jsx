import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Search from "../../components/Search/Search";
import Sorting from "../../components/Sorting/Sorting";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContexto";
import PetCard3 from "../../components/PetCard/PetCard3";

const Favoritos = () => {
  const { usuario } = useAuth();
  const us = usuario();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/users/favoritos/${us.usuario}`);
        setFavoritos(response.data);
      } catch (error) {
        console.error("Error al obtener las mascotas favoritas", error);
        toast.error("Error al obtener las mascotas favoritas");
      }
    };
    fetchFavoritos();
  }, [us.usuario]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <Search />
          <Sorting />
          <h1 className="text-2xl font-bold mb-4">Favoritos</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {favoritos.map((mascota) => (
    <PetCard3 key={mascota.mascotaId} mascota={mascota} />
  ))}
</div>

        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Favoritos;
