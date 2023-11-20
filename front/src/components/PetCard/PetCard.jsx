import React from 'react';
import { BsStar } from 'react-icons/bs';

const PetCard = ({ image, raza, edad, color, tamaño, onAddToFavorites }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg m-4">
      <img className="w-full h-auto" src={image} alt={`Imagen de ${raza}`} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{raza}</div>
        <p>
          Edad: {edad} | Color: {color} | Tamaño: {tamaño}
        </p>
      </div>
      <div className="px-6 py-4">
        <button
          onClick={onAddToFavorites}
          className="bg-yellow-500 text-black p-2 rounded hover:bg-yellow-600 focus:outline-none"
        >
          <BsStar className="mr-1" /> Agregar a Favoritos
        </button>
      </div>
    </div>
  );
};

export default PetCard;
