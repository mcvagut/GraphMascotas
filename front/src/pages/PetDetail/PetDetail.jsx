import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from 'path-to-your-components/Navbar';
import Sidebar from 'path-to-your-components/Sidebar';
import Footer from 'path-to-your-components/Footer';

const PetDetail = () => {
  const [petDetails, setPetDetails] = useState(null);
  const { mascotaId } = useParams();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/pets/${mascotaId}`);
        setPetDetails(response.data); // Assuming your backend returns pet details in the response
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
            <>
              <img src={petDetails.image} alt={`Imagen de ${petDetails.raza}`} />
              <h1>{petDetails.raza}</h1>
              <p>{`Edad: ${petDetails.edad} | Color: ${petDetails.color} | Tamaño: ${petDetails.tamaño}`}</p>
              <button>Adoptar</button> {/* Add your adoption logic/handler */}
            </>
          ) : (
            <p>Loading pet details...</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PetDetail;
