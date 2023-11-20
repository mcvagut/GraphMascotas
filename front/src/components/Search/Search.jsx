import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex items-center justify-center mb-4">
    <div className="w-auto rounded-md shadow-shadowp p-1 flex">
      <input
        type="text"
        placeholder="Buscar mascotas..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-128 p-2  rounded-l focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="w-24 bg-purple text-white p-2 rounded-r hover:bg-purple2 focus:outline-none font-bold"
      >
        Buscar
      </button>
    </div>
  </div>
  );
};

export default Search;
