import React from "react";
import { MdOutlinePets } from "react-icons/md";
import { useNavigate } from "react-router-dom";



const PetCard3 = ({ mascota }) => {


  const navigate = useNavigate();



  // const handleAddFavorite = async () => {
  //   try {
  //     const { mascotaId, categoria, raza } = mascota;
  
  //     // Verifica que la mascota tenga la información necesaria
  //     if (!mascotaId || !categoria || !raza) {
  //       console.error("Información de la mascota incompleta");
  //       return;
  //     }
  
  //     await axios.post(
  //       `http://localhost:8800/api/users/${us.usuario}/favoritos`,
  //       { mascotaId, categoria, raza, usuario: us.usuario }
  //     );
  
  //     // Actualiza el estado local
  //     setAgregadoAFavoritos(true);
  //   } catch (error) {
  //     console.error("Error al agregar a favoritos", error);
  //   }
  // };
  
  
  

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
        <div className="font-bold text-xl mb-2">{mascota.raza}</div>
        <p>
          <strong>Edad:</strong> {mascota.edad} <strong>|</strong>{" "}
          <strong>Color:</strong> {mascota.color} <strong>|</strong>{" "}
          <strong>Tamaño:</strong> {mascota.tamaño}
        </p>
      </div>
      <div className="px-6 py-4 flex flex-col items-center mb-4 place-content-center ">
        {/* <div>
          <button
            onClick={handleAddFavorite}
            className="bg-fav flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
          >
            <BsStar className="mr-2" /> Agregar a Favoritos
          </button>
        </div> */}
        <div>
          <button
            onClick={handleNavigate()}
            className="bg-fav mt-4 flex items-center text-white font-bold p-2 rounded hover:bg-purple focus:outline-none "
          >
            <MdOutlinePets className="mr-2" /> Detalles de Mascota
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard3;
