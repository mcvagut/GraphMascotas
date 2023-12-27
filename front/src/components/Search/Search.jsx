import React, { useState } from 'react';
import axios from 'axios';
import { useRef } from 'react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setFoundPets] = useState([]);
  const searchTimeout = useRef(null);

  const handleInputChange = async (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        if (newSearchTerm.trim() === '') {
          setFoundPets([]);
          onSearch([]);
        } else {
          const response = await axios.get(
            `http://localhost:8800/api/pets/buscar/${newSearchTerm}`
          );
          const pets = response.data;
          setFoundPets(pets);
          onSearch(pets);
        }
      } catch (error) {
        console.error('Error al buscar mascotas:', error);
      }
    }, 300); // Espera 300 milisegundos (ajusta según tus necesidades)
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <div className="w-auto rounded-md shadow-shadowp p-1 flex">
        <input
          type="text"
          id='searchBar'
          placeholder="Buscar mascotas por nombre..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-128 p-2  rounded-l focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Search;
