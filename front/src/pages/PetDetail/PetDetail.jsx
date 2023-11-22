import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContexto";



const PetDetail = () => {
  const [petDetails, setPetDetails] = useState("");
  const { mascotaId } = useParams();
  const [organizationDetails, setOrganizationDetails] = useState("");
  const [adoptionStatus, setAdoptionStatus] = useState('');
  const [adoptionRequestPending, setAdoptionRequestPending] = useState(false);
  
  const {usuario} = useAuth();
  const us = usuario();



  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/pets/${mascotaId}`
        );
        setPetDetails(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [mascotaId]);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        if (petDetails && petDetails.organizationId) {
          const response = await axios.get(
            `http://localhost:8800/api/rescueOrganizations/${petDetails.organizationId}`
          );
          setOrganizationDetails(response.data);
        }
      } catch (error) {
        console.error("Error al obtener detalles de la organización:", error);
      }
    };

    fetchOrganizationDetails();
  }, [petDetails]);
  
  const handleAdoptionRequest = async () => {
    if (!adoptionRequestPending) {
      setAdoptionRequestPending(true);
  
      try {
        const response = await axios.post(
          'http://localhost:8800/api/users/solicitudes-adopcion',
          {
            usuario: us.usuario, // Cambia esto según la lógica de tu aplicación
            mascotaId: petDetails.mascotaId,
          }
        );
        console.log('Respuesta del servidor:', response.data);
        setAdoptionStatus(response.data.message);
      } catch (error) {
        console.error('Error al solicitar adopción:', error);
        // Manejar errores
      } finally {
        setAdoptionRequestPending(false);
      }
    }
  };

  //console.log('organizationDetails:', organizationDetails);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          {petDetails ? (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {petDetails.fotos.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`Imagen ${index + 1} de ${petDetails.raza}`}
                    className="object-cover h-48 w-96 rounded-md mb-6 w-pet-image h-pet-image"
                  />
                ))}
              </div>
              <h1 className="text-3xl font-bold mb-4">{petDetails.nombre}</h1>
              <p className="text-gray-600">
                <div className="mb-4">
                  <strong>Descripción: </strong>
                  {`${petDetails.descripcion}`}
                </div>
                <div className="mb-4">
                  <strong>Edad: </strong>
                  {`${petDetails.edad}`}
                </div>
                <div className="mb-4">
                  <strong>Color: </strong>
                  {`${petDetails.color}`}
                </div>
                <div className="mb-4">
                  <strong>Tamaño: </strong>
                  {`${petDetails.tamaño}`}
                </div>
              </p>

              <div className="mb-4">
                <p className="text-gray-600">
                  <strong>Categoría:</strong>
                  {` ${petDetails.categoria} | `}
                  <strong>Sexo:</strong>
                  {` ${petDetails.sexo} | `}
                  <strong>Ubicación:</strong>
                  {` ${petDetails.ubicacion}`}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">
                  <strong>Organización:</strong>
                  {` ${organizationDetails.nombre} `}
                </p>
              </div>

              <button onClick={handleAdoptionRequest}
              className="w-96 bg-purple2 text-white font-extrabold px-4 py-2 rounded-md hover:bg-purple focus:outline-none focus:ring focus:border-blue-300">
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
