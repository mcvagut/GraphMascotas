import React, {useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import Search from "../../components/Search/Search";
import Sorting from "../../components/Sorting/Sorting";
import PetCard from "../../components/PetCard/PetCard";
// import { useAuth } from "../../context/AuthContexto";
import axios from "axios";

const Home = () => {


  // const { token } = useAuth();

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [token, navigate]);

  // if (!token) {
  //   return <div>Redirecting...</div>;
  // }

const [categorias, setCategorias] = useState([]);

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

return (
  <div className="flex flex-col h-screen">
    <Navbar/>
    <div className="flex flex-1 overflow-hidden">
        <Sidebar />
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
      <Search />
      <Sorting />
      {categorias.map((categoria) => (
        <div key={categoria.categoriaId} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{categoria.tipo}</h2>
          <div className="flex flex-wrap justify-center">
            {categoria.mascotas.map((mascota) => (
              <PetCard key={mascota.mascotaId} mascota={mascota} />
            ))}
          </div>
        </div>
      ))}
    </main>
    </div>
      <Footer />
  </div>
);
};

export default Home;