import React from 'react';
import { BsStar } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ mascota }) => {
  
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    return () => {
      navigate(`/administrarSolicitud`);
    };
  }

  
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-shadowp m-4 ">
      <img className="object-cover h-48 w-96 rounded-md mb-6 w-pet-image h-pet-image cursor-pointer" src={mascota.fotos[0]} alt={`Imagen de ${mascota.raza}`} onClick={handleNavigate()} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{mascota.nombre}</div>
        <p>
          <strong>Edad:</strong> {mascota.edad} <strong>|</strong> <strong>Color:</strong> {mascota.color} <strong>|</strong> 
        <p> <strong>Tamaño:</strong> {mascota.tamaño}</p> 
        </p>
      </div>
      <div className="px-6 py-4 flex flex-col items-center mb-4 place-content-center ">
        <div>
        <button
          onClick={handleNavigate()}
          className="bg-fav flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
        >
          <BsStar className="mr-2" /> Gestionar Solicitud
        </button>
        </div>
        <div>
        {/* <button
          onClick={handleNavigate()}
          className="bg-fav mt-4 flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
        >
          <MdOutlinePets className="mr-2" /> Quiero saber más!
        </button> */}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
