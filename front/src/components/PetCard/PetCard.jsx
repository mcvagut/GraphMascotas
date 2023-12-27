import React from "react";
import { BsStar } from "react-icons/bs";
import { MdOutlinePets } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContexto";
import axios from "axios";
import {toast, Toaster} from 'react-hot-toast';

const PetCard = ({ mascota }) => {
  const [, setAgregadoAFavoritos] = useState(false);

  const navigate = useNavigate();

  const { usuario } = useAuth();
  const us = usuario();


  const handleAddFavorite = async () => {
    try {
      const { mascotaId, categoria, raza } = mascota;
  
      // Verifica que la mascota tenga la información necesaria
      if (!mascotaId || !categoria || !raza) {
        console.error("Información de la mascota incompleta");
        return;
      }
  
      await axios.post(
        `http://localhost:8800/api/users/${us.usuario}/favoritos`,
        { mascotaId, categoria, raza, usuario: us.usuario }
      );
      toast.success("Mascota agregada a favoritos");

  
      // Actualiza el estado local
      setAgregadoAFavoritos(true);
    } catch (error) {
      console.error("Error al agregar a favoritos", error);
    }
  };
  
  
  

  const handleNavigate = () => {
    return () => {
      navigate(`/pets/${mascota.mascotaId}`);
    };
  };

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-shadowp m-4 ">
      <img
        className="object-cover h-48 w-96 rounded-md mb-6 w-pet-image h-pet-image cursor-pointer"
        src={mascota.fotos[0]}
        alt={`Imagen de ${mascota.raza}`}
        onClick={handleNavigate()}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{mascota.nombre}</div>
        <p>
          <strong>Edad (a):</strong> {mascota.edad} <strong>|</strong>{" "}
          <strong>Color:</strong> {mascota.color} <strong>|</strong>{" "}
          <strong>Tamaño:</strong> {mascota.tamaño} <strong>|</strong>{" "}
          <strong>Raza:</strong> {mascota.raza} <strong>|</strong>{" "}
        </p>
      </div>
      <div className="px-6 py-4 flex flex-col items-center mb-4 place-content-center ">
        <div>
          <button
            onClick={handleAddFavorite}
            id="btnFav"
            className="bg-fav flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
          >
            <BsStar className="mr-2" /> Agregar a Favoritos
          </button>
        </div>
        <div>
          <button
            onClick={handleNavigate()}
            id="btnVerMas"
            className="bg-fav mt-4 flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
          >
            <MdOutlinePets className="mr-2" /> Quiero saber más!
          </button>
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default PetCard;
