import React from 'react';
import { BsArrowUp, BsArrowDown, BsClock } from 'react-icons/bs';

const Sorting = ({ onSortChange }) => {
  const handleSortClick = (sortOption) => {
    onSortChange(sortOption);
  };

  return (
    <div className="flex items-center mb-4 place-content-center ">
      <button
        onClick={() => handleSortClick('razaAsc')}
        className="bg-purple2 font-bold text-white flex items-center p-2 border border-gray-300 rounded-lg focus:outline-none"
      >
        <BsArrowUp className="mr-1" /> Raza (A-Z)
      </button>
      <button
        onClick={() => handleSortClick('razaDesc')}
        className="bg-purple2 font-bold text-white flex items-center p-2 border border-gray-300 rounded-lg focus:outline-none"
      >
        <BsArrowDown className="mr-1" /> Raza (Z-A)
      </button>
      <button
        onClick={() => handleSortClick('fecha')}
        className="bg-purple2 font-bold text-white flex items-center p-2 border border-gray-300 rounded-lg focus:outline-none"
      >
        <BsClock className="mr-1" /> Fecha de Publicación
      </button>
      {/* Agrega más botones según sea necesario */}
    </div>
  );
};

export default Sorting;
