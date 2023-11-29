import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContexto";

const NuevoUsuario = ({ closeModal, actualizarUsuarios }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [isAdmin, setAdmin] = useState(null);
  //const [organization, setOrganization] = useState(null);

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

  const handleSubmit = async () => {
    try {
      const nuevoUsuario = {
        nombre,
        apellido,
        email,
        usuario,
        password,
        pais,
        ciudad,
        telefono,
        fechaNacimiento,
        isAdmin,
        isOrganization: false,
      };

      const responseNeo4j = await axios.post(
        "http://localhost:8800/api/users/",
        nuevoUsuario,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (responseNeo4j.status === 201) {
        console.log("Usuario creado exitosamente");
        actualizarUsuarios();
        closeModal();
      } else {
        console.error(
          "Error al crear el Usuario en Neo4j:",
          responseNeo4j.statusText
        );
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
    }
  };

  return (
    <div className="mx-auto p-4 max-w-screen-md">
      <form className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pais
          </label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefono
          </label>
          <input
            type="phone"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={telefono}
            min={1}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700">
    Administrador
  </label>
  <select
    required
    className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
    value={isAdmin}  
    onChange={(e) => setAdmin(e.target.value === "true" ? true : false)}
  >
    <option value="">El usuario es Administrador?</option>
    <option value="true">Si</option>
    <option value="false">No</option>
  </select>
</div>


        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Organizacion</label>
          <select
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          >
            <option value="">El usuario es una Organización?</option>
            <option value="true">Si</option>
            <option value="false">No</option>
          </select>
        </div> */}

        <button
          type="button"
          onClick={handleSubmit}
          className="col-span-2 bg-greenP text-white py-2 px-4 rounded-md hover:bg-green3 transition-colors duration-300"
        >
          Agregar Usuario
        </button>
        {/* <button
          type="button"
          onClick={handleClose()}
          className="col-span-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300"
        >
          Cerrar
        </button> */}
      </form>
    </div>
  );
};

export default NuevoUsuario;
