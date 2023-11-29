import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContexto";

const NuevaOrg = ({ closeModal, actualizarOrganizaciones }) => {
  const [files, setFiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaFundacion, setFechaFundacion] = useState("");

  const [imagenPrevia, setImagenPrevia] = useState([]);

  const [, setOrganizaciones] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const obtenerOrganizaciones = async () => {
      try {
        const response = await fetch(
          "http://localhost:8800/api/rescueOrganizations/"
        ); // Ajusta la URL según tu ruta
        const data = await response.json();
        setOrganizaciones(data);
      } catch (error) {
        console.error("Error al obtener organizaciones:", error);
      }
    };
    obtenerOrganizaciones();
  }, []);

  const handleSeleccionImagenes = (e) => {
    setFiles([...files, ...e.target.files]);
    setImagenPrevia([
      ...imagenPrevia,
      ...Object.values(e.target.files).map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleSubmit = async () => {
    try {
      const promesasSubida = await Promise.all(
        Object.values(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "upload");

          const responseCloudinary = await axios.post(
            "https://api.cloudinary.com/v1_1/dwwj8mhse/image/upload",
            formData
          );

          const { url } = responseCloudinary.data;

          return url;
        })
      );

      const nuevaOrg = {
        nombre,
        email,
        usuario,
        password,
        ciudad,
        telefono,
        nombreContacto,
        descripcion,
        fechaFundacion,
        fotos: promesasSubida,
        isOrganization: true,
        isAdmin: false,
      };

      const responseNeo4j = await axios.post(
        "http://localhost:8800/api/rescueOrganizations/",
        nuevaOrg,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (responseNeo4j.status === 201) {
        console.log("Organización creada exitosamente");
        actualizarOrganizaciones();
        closeModal();
      } else {
        console.error(
          "Error al crear la organización en Neo4j:",
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
            required
            type="text"
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
            required
            type="password"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            required
            type="text"
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
            required
            type="phone"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contacto
          </label>
          <input
            required
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={nombreContacto}
            onChange={(e) => setNombreContacto(e.target.value)}
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            required
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Fundación
          </label>
          <input
            required
            type="date"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={fechaFundacion}
            onChange={(e) => setFechaFundacion(e.target.value)}
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagenes
          </label>
          <input
            required
            type="file"
            id="fotos"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            onChange={handleSeleccionImagenes}
            multiple
          />
          {imagenPrevia.length > 0 && (
            <div className="mt-2 flex space-x-2">
              {imagenPrevia.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Previsualización ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

      

        <button
          type="button"
          onClick={handleSubmit}
          className="col-span-2 bg-greenP text-white py-2 px-4 rounded-md hover:bg-green3 transition-colors duration-300"
        >
          Agregar Organización
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

export default NuevaOrg;
