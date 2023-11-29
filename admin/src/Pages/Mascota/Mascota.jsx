import React, {useState, useEffect} from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NuevaMascota from "../../Pages/Mascota/NuevaMascota";
import { useAuth } from "../../context/AuthContexto";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';

const Mascota = () => {
    const { token } = useAuth();
    const [mascotas, setMascotas] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);


    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Realiza una solicitud al backend para obtener la lista de mascotas
            const response = await axios.get('http://localhost:8800/api/pets/');
            setMascotas(response.data);
          } catch (error) {
            console.error('Error al obtener las mascotas:', error);
          }
        };
    
        fetchData();
      }, []);

    useEffect(() => {
        if (!token) {
          navigate("/login");
        }
      }, [token, navigate]);
    
      if (!token) {
        return <div>Redirecting...</div>;
      }
      
      const actualizarMascotas = async () => {
        try {
          const response = await axios.get('http://localhost:8800/api/pets/');
          setMascotas(response.data);
        } catch (error) {
          console.error('Error al obtener las mascotas:', error);
        }
      };
      

        const handleEliminarMascota = async (mascotaId) => {
            try {
              await axios.delete(`http://localhost:8800/api/pets/${mascotaId}`);
              const response = await axios.get('http://localhost:8800/api/pets/');
              setMascotas(response.data);
            } catch (error) {
              console.error('Error al eliminar la mascota:', error);
            }
          }
          const handleAgregarMascota = () => {
            setModalIsOpen(true);
          };
        
          const closeModal = () => {
            setModalIsOpen(false);
          };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <div className="flex justify-between mb-6">
            <button className="bg-greenP text-white py-2 px-4 rounded-md hover:bg-green1 font-bold transition-colors duration-300"
            onClick={handleAgregarMascota}
            >
              Agregar Mascota
            </button>
          </div>

          <table className="min-w-full bg-white rounded-lg overflow-hidden divide-y divide-gray-300 shadow-lg">
            <thead className="bg-green1 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24">ID</th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24">Nombre</th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24">Raza</th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24">Categoría</th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mascotas.map((mascota) => (
                <tr key={mascota.mascotaId}>
                  <td className="py-2 px-4 text-lg">{mascota.mascotaId}</td>
                  <td className="py-2 px-4 text-lg">{mascota.nombre}</td>
                  <td className="py-2 px-4 text-lg">{mascota.raza}</td>
                  <td className="py-2 px-4 text-lg">{mascota.categoria}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="bg-greenP text-white py-1 px-2 rounded-md mr-2 hover:bg-green1 font-bold transition-colors duration-300"
                    >
                      Actualizar
                    </button>
                    <button
                      className="bg-greenP text-white py-1 px-2 rounded-md mt-2 hover:bg-green1 font-bold transition-colors duration-300"
                      onClick={() => handleEliminarMascota(mascota.mascotaId)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Agregar Mascota"
          >
            <h2>Agregar Mascota</h2>
            <NuevaMascota closeModal={closeModal} actualizarMascotas={actualizarMascotas}/>
            <button onClick={closeModal}>Cerrar</button>
          </Modal>
        </main>
      </div>
    </div>

  );
};

export default Mascota;
