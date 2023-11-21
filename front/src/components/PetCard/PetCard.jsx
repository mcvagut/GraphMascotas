import React from 'react';
import { BsStar } from 'react-icons/bs';
import { MdOutlinePets } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const PetCard = ({ mascotaId, image, raza, edad, color, tamaño, onAddToFavorites }) => {
  
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    return () => {
      navigate(`/pet/${mascotaId}`);
    };
  }

  
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-shadowp m-4 ">
      <img className="w-full h-auto cursor-pointer" src={image} alt={`Imagen de ${raza}`} onClick={handleNavigate()} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{raza}</div>
        <p>
          <strong>Edad:</strong> {edad} <strong>|</strong> <strong>Color:</strong> {color} <strong>|</strong> <strong>Tamaño:</strong> {tamaño}
        </p>
      </div>
      <div className="px-6 py-4 flex flex-col items-center mb-4 place-content-center ">
        <div>
        <button
          onClick={onAddToFavorites}
          className="bg-fav flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
        >
          <BsStar className="mr-2" /> Agregar a Favoritos
        </button>
        </div>
        <div>
        <button
          onClick={handleNavigate()}
          className="bg-fav mt-4 flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
        >
          <MdOutlinePets className="mr-2" /> Quiero saber más!
        </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
