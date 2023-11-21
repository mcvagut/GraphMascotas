import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';


const PetDetail = () => {
  const [petDetails, setPetDetails] = useState(null);
  const { mascotaId } = useParams();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/pets/${mascotaId}`);
        setPetDetails(response.data);
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };

    fetchPetDetails();
  }, [mascotaId]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
        {petDetails ? (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <img
                src={petDetails.fotos[0]}
                alt={`Imagen de ${petDetails.raza}`}
                className="w-full h-auto rounded-md mb-6"
              />
              <h1 className="text-3xl font-bold mb-4">{petDetails.nombre}</h1>
              <p className="text-gray-600 mb-4">
                {`Descripción: ${petDetails.descripcion} | Edad: ${petDetails.edad} | Color: ${petDetails.color} | Tamaño: ${petDetails.tamaño}`}
              </p>
              <p className="text-gray-600 mb-4">
                {`Categoría: ${petDetails.categoria} | Sexo: ${petDetails.sexo} | Ubicación: ${petDetails.ubicacion}`}
              </p>
              <p className="text-gray-600 mb-4">
                {`Organización: ${petDetails.organizationId}`}
              </p>
              <button
                className=" w-96 bg-purple2 text-white font-extrabold px-4 py-2 rounded-md hover:bg-purple focus:outline-none focus:ring focus:border-blue-300"
              
              >
                Adoptar
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading pet details...</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PetDetail;
