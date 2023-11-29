import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContexto";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NuevaOrg from "../../Pages/Org/NuevaOrg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

const Org = () => {
  const { token } = useAuth();
  const [organizaciones, setOrganizaciones] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/rescueOrganizations/"
        );
        setOrganizaciones(response.data);
      } catch (error) {
        console.error("Error al obtener las organizaciones:", error);
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

  const actualizarOrganizaciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/rescueOrganizations/"
      );
      setOrganizaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las organizaciones:", error);
    }
  };

  const handleEliminarOrganizacion = async (organizationId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/rescueOrganizations/${organizationId}`
      );
      const response = await axios.get(
        "http://localhost:8800/api/rescueOrganizations/"
      );
      setOrganizaciones(response.data);
    } catch (error) {
      console.error("Error al eliminar la organizacion:", error);
    }
  };

  const handleAgregarOrganizacion = () => {
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
            <button
              className="bg-greenP text-white py-2 px-4 rounded-md hover:bg-green1 font-bold transition-colors duration-300"
              onClick={handleAgregarOrganizacion}
            >
              Agregar Organización
            </button>
          </div>

          <table className="min-w-full bg-white rounded-lg overflow-hidden divide-y divide-gray-300 shadow-lg">
            <thead className="bg-green1 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24 text-center">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24 text-center">
                  Nombre
                </th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24 text-center">
                  Usuario
                </th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-1/6 text-center">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-1/6 text-center">
                  Teléfono
                </th>
                <th className="py-3 px-4 text-left text-xl font-bold uppercase w-24 text-center">
                  Ciudad
                </th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {organizaciones.map((organizacion) => (
                <tr key={organizacion.organizationId}>
                  <td className="py-2 px-4 text-lg text-center">{organizacion.organizationId}</td>
                  <td className="py-2 px-4 text-lg text-center">{organizacion.nombre}</td>
                  <td className="py-2 px-4 text-lg text-center">{organizacion.usuario}</td>
                  <td className="py-2 px-4 text-lg text-center">{organizacion.email}</td>
                  <td className="py-2 px-4 text-lg text-center">{organizacion.telefono}</td>
                  <td className="py-2 px-4 text-lg text-center">{organizacion.ciudad}</td>
                  <td className="py-2 px-4 text-center">
                    <button className="bg-greenP text-white py-1 px-2 rounded-md mr-2 hover:bg-green1 font-bold transition-colors duration-300">
                      Actualizar
                    </button>
                    <button
                      className="bg-greenP text-white py-1 px-2 rounded-md mt-2 hover:bg-green1 font-bold transition-colors duration-300"
                      onClick={() => handleEliminarOrganizacion(organizacion.organizationId)}
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
            contentLabel="Agregar Organización"
          >
            <h2>Agregar Organización</h2>
            <NuevaOrg
              closeModal={closeModal}
              actualizarOrganizaciones={actualizarOrganizaciones}
            />
            <button onClick={closeModal}>Cerrar</button>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Org;
