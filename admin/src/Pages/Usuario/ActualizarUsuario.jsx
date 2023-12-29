import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContexto";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const ActualizarUsuario = ({ closeModal, actualizarUsuarios, usuarioSeleccionado }) => {
  const [usuarioData, setUsuarioData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    pais: "",
    ciudad: "",
    telefono: "",
    fechaNacimiento: new Date(usuarioSeleccionado.fechaNacimiento),
    isAdmin: null,
  });

  useEffect(() => {
    const fetchUsuarioData = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/users/${usuarioSeleccionado.usuario}`);
        setUsuarioData(response.data);
      } catch (error) {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    };

    if (usuarioSeleccionado) {
      fetchUsuarioData();
    }
  }, [usuarioSeleccionado]);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return <div>Redirecting...</div>;
  }

  const handleActualizarUsuario = async () => {
    try {
      const datosActualizados = {
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        email: usuarioData.email,
        usuario: usuarioData.usuario,
        password: usuarioData.password,
        pais: usuarioData.pais,
        ciudad: usuarioData.ciudad,
        telefono: usuarioData.telefono,
        fechaNacimiento: usuarioData.fechaNacimiento,
        isAdmin: usuarioData.isAdmin,
      };

      await axios.put(`http://localhost:8800/api/users/${usuarioSeleccionado.usuario}`, datosActualizados);

      await actualizarUsuarios();

      closeModal();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 border rounded shadow-lg">
  <h2 className="text-2xl font-bold mb-4">Actualizar Usuario</h2>
  <form>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="nombre">
          Nombre:
        </label>
        <input
          type="text"
          id="nombre"
          className="w-full border p-2 rounded"
          value={usuarioData.nombre}
          onChange={(e) => setUsuarioData({ ...usuarioData, nombre: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="apellido">
          Apellido:
        </label>
        <input
          type="text"
          id="apellido"
          className="w-full border p-2 rounded"
          value={usuarioData.apellido}
          onChange={(e) => setUsuarioData({ ...usuarioData, apellido: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          type="text"
          id="email"
          className="w-full border p-2 rounded"
          value={usuarioData.email}
          onChange={(e) => setUsuarioData({ ...usuarioData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="usuario">
          Usuario:
        </label>
        <input
          type="text"
          id="usuario"
          className="w-full border p-2 rounded"
          value={usuarioData.usuario}
          onChange={(e) => setUsuarioData({ ...usuarioData, usuario: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="w-full border p-2 rounded"
          value={usuarioData.password}
          onChange={(e) => setUsuarioData({ ...usuarioData, password: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="pais">
          País:
        </label>
        <input
          type="text"
          id="pais"
          className="w-full border p-2 rounded"
          value={usuarioData.pais}
          onChange={(e) => setUsuarioData({ ...usuarioData, pais: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="ciudad">
          Ciudad:
        </label>
        <input
          type="text"
          id="ciudad"
          className="w-full border p-2 rounded"
          value={usuarioData.ciudad}
          onChange={(e) => setUsuarioData({ ...usuarioData, ciudad: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="telefono">
          Teléfono:
        </label>
        <input
          type="text"
          id="telefono"
          className="w-full border p-2 rounded"
          value={usuarioData.telefono}
          onChange={(e) => setUsuarioData({ ...usuarioData, telefono: e.target.value })}
        />
      </div>

      <div className="mb-4">
  <label className="block text-sm font-semibold mb-2" htmlFor="fechaNacimiento">
    Fecha de Nacimiento:
  </label>
  <DatePicker
    selected={usuarioData.fechaNacimiento ? new Date(usuarioData.fechaNacimiento) : null}
    onChange={(date) => setUsuarioData({ ...usuarioData, fechaNacimiento: date })}
    dateFormat="yyyy/MM/dd" // ajusta el formato de fecha según lo que recibes
    className="w-full border p-2 rounded"
  />
</div>

      <div>
        <label className="block text-sm font-semibold mb-2" htmlFor="isAdmin">
          Es Admin:
        </label>
        <input
          type="text"
          id="isAdmin"
          className="w-full border p-2 rounded"
          value={usuarioData.isAdmin}
          onChange={(e) => setUsuarioData({ ...usuarioData, isAdmin: e.target.value })}
        />
      </div>
    </div>

    <button
      type="button"
      className="bg-greenP text-white py-2 px-4 rounded-md hover:bg-green1 font-bold transition-colors duration-300"
      onClick={handleActualizarUsuario}
    >
      Actualizar Usuario
    </button>
  </form>
  <button className="mt-4 text-gray-600" onClick={closeModal}>
    Cerrar
  </button>
</div>


  );
};

export default ActualizarUsuario;
