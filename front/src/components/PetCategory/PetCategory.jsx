import React from 'react';
import PetCard from '../PetCard/PetCard';

const PetCategory = ({ categoryName, pets, onAddToFavorites }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
      <div className="flex flex-wrap justify-center">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            mascotaId={pet.mascotaId}
            image={pet.image}
            raza={pet.raza}
            edad={pet.edad}
            color={pet.color}
            tamaño={pet.tamaño}
            onAddToFavorites={() => onAddToFavorites(pet.mascotaId)}
          />
        ))}
      </div>
    </div>
  );
};

export default PetCategory;
