import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Header from "../../Components/Header/Header";
import NuevoUsuario from "../../Pages/Usuario/NuevoUsuario";
import { useAuth } from "../../context/AuthContexto";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import ActualizarUsuario from "./ActualizarUsuario";

const Usuario = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza una solicitud al backend para obtener la lista de mascotas
        const response = await axios.get("http://localhost:8800/api/users/");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener las mascotas:", error);
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

  const actualizarUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/users/");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener las mascotas:", error);
    }
  };

  const handleEliminarUsuarios = async (usuario) => {
    try {
      await axios.delete(`http://localhost:8800/api/users/${usuario}`);
      const response = await axios.get("http://localhost:8800/api/users/");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al eliminar la mascota:", error);
    }
  };
  const handleAgregarUsuario = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleActualizarUsuario = (usuario) => {
    console.log("USUARIOOOOOO",usuario);
    setUsuarioSeleccionado(usuario);
    setModalIsOpen2(true);
  };

  const closeModalAct = () => {
    setModalIsOpen2(false);
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
              onClick={handleAgregarUsuario}
            >
              Agregar Usuario
            </button>
          </div>

          <table className="min-w-full bg-white rounded-lg overflow-hidden divide-y divide-gray-300 shadow-lg">
            <thead className="bg-green1 text-white">
              <tr>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  usuario
                </th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  Nombre
                </th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  Teléfono
                </th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  País
                </th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  Administrador
                </th>
                <th className="py-3 px-4 text-center text-xl font-bold uppercase w-24">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.usuario}>
                  <td className="py-2 px-4 text-lg text-center">
                    {usuario.usuario}
                  </td>
                  <td className="py-2 px-4 text-lg text-center">
                    {usuario.nombre}
                  </td>
                  <td className="py-2 px-4 text-lg text-center">
                    {usuario.telefono}
                  </td>
                  <td className="py-2 px-4 text-lg text-center">
                    {usuario.pais}
                  </td>
                  <td className="py-2 px-4 text-lg text-center">
                    {usuario.isAdmin.toString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      className="bg-greenP text-white py-1 px-2 rounded-md mr-2 hover:bg-green1 font-bold transition-colors duration-300"
                      onClick={() => handleActualizarUsuario(usuario)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="bg-greenP text-white py-1 px-2 rounded-md mt-2 hover:bg-green1 font-bold transition-colors duration-300"
                      onClick={() => handleEliminarUsuarios(usuario.usuario)}
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
            contentLabel="Agregar Usuario"
            className="Modal mx-96 my-24 rounded-xl"
          >
            <NuevoUsuario
              closeModal={closeModal}
              actualizarUsuarios={actualizarUsuarios}
            />
          </Modal>
          <Modal
            isOpen={modalIsOpen2}
            onRequestClose={closeModalAct}
            contentLabel="Actualizar Usuario"
            className="Modal mx-96 my-24 rounded-xl"
            
            
          >
            <ActualizarUsuario
              closeModal={closeModalAct}
              actualizarUsuarios={actualizarUsuarios}
              usuarioSeleccionado={usuarioSeleccionado}
            />
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default Usuario;
