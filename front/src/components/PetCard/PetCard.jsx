import React from 'react';
import { BsStar } from 'react-icons/bs';

const PetCard = ({ image, raza, edad, color, tamaño, onAddToFavorites }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-shadowp m-4 ">
      <img className="w-full h-auto" src={image} alt={`Imagen de ${raza}`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{raza}</div>
        <p>
          <strong>Edad:</strong> {edad} <strong>|</strong> <strong>Color:</strong> {color} <strong>|</strong> <strong>Tamaño:</strong> {tamaño}
        </p>
      </div>
      <div className="px-6 py-4 flex items-center mb-4 place-content-center ">
        <button
          onClick={onAddToFavorites}
          className="bg-fav flex items-center text-white font-bold p-2 rounded hover:bg-yellow focus:outline-none "
        >
          <BsStar className="mr-2" /> Agregar a Favoritos
        </button>
      </div>
    </div>
  );
};

export default PetCard;
