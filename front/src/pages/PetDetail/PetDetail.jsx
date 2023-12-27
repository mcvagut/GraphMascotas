import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContexto";
import { IoCloseCircle, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useRef } from "react";
import io from "socket.io-client";
import { toast,Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const PetDetail = () => {
  const [petDetails, setPetDetails] = useState("");
  const { mascotaId } = useParams();
  const [organizationDetails, setOrganizationDetails] = useState("");
  const [, setAdoptionStatus] = useState("");
  const [adoptionRequestPending, setAdoptionRequestPending] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { usuario } = useAuth();
  const us = usuario();

  const [, setSocket] = useState(null);
  const socketRef = useRef(null);

  const navigate = useNavigate();

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
      socketRef.current.on('notificacion2', (data) => {
        console.log('Resultado de adopción recibido en HomeOrg:', data);
        toast[data.aceptar ? 'success' : 'error'](data.mensaje);
      });
    }
  }, []);
  

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/pets/${mascotaId}`);
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
        const response = await axios.post("http://localhost:8800/api/users/solicitudes-adopcion", {
          usuario: us.usuario, // Cambia esto según la lógica de tu aplicación
          mascotaId: petDetails.mascotaId,
        });
        console.log("Respuesta del servidor:", response.data);
        setAdoptionStatus(response.data.message);
        if(response.data){
          toast.success("Solicitud de adopción enviada!, espere la respuesta de la organización");
          setTimeout(() => {
            navigate("/home");
          }
          , 2000);
        }
      } catch (error) {
        console.error("Error al solicitar adopción:", error);
        // Manejar errores
      } finally {
        setAdoptionRequestPending(false);
      }
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : petDetails.fotos.length - 1
    );
    setSelectedImage(petDetails.fotos[currentImageIndex]);
  };
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
    prevIndex < petDetails.fotos.length - 1 ? prevIndex + 1 : 0
  );
  setSelectedImage(petDetails.fotos[currentImageIndex]);};

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
                    className="cursor-pointer object-cover h-48 w-96 rounded-md mb-6 w-pet-image h-pet-image"
                    onClick={() => {
                      setModalOpen(true);
                      setSelectedImage(foto);
                      setCurrentImageIndex(index);
                    }}
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
              <button
                onClick={handleAdoptionRequest}
                className="w-96 bg-purple2 text-white font-extrabold px-4 py-2 rounded-md hover:bg-purple focus:outline-none focus:ring focus:border-blue-300 mx-auto block"
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
      {modalOpen && (
  <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
    <div className="relative mx-auto my-6 max-w-md">
      <div className="relative flex flex-col items-center w-full h-2/5 bg-white rounded-lg overflow-hidden">
        <div className="absolute bottom-1/2 left-5 transform -translate-x-1/2">
          <div className="flex items-center justify-center bg-gray-200 p-3 rounded-full cursor-pointer">
            <IoChevronBack
              className="h-10 w-10 text-gray-600"
              onClick={handlePrevImage}
            />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center justify-center bg-red-500 p-3 rounded-full cursor-pointer">
            <IoCloseCircle
              className="h-8 w-8 text-white"
              onClick={() => {
                setModalOpen(false);
                setSelectedImage(null);
              }}
            />
          </div>
        </div>
        <div className="absolute bottom-1/2 right-0 transform -translate-x-2/2">
          <div className="flex items-center justify-center bg-gray-200 p-3 rounded-full cursor-pointer">
            <IoChevronForward
              className="h-10 w-10 text-gray-600"
              onClick={handleNextImage}
            />
          </div>
        </div>
        <img
          src={selectedImage}
          alt="Imagen en tamaño completo"
          className="object-contain w-full h-full"
        />
      </div>
    </div>
    <Toaster/>
  </div>
)}



    </div>
  );
};

export default PetDetail;
