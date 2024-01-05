import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContexto";
import { toast, Toaster } from "react-hot-toast";

const NuevaMascota = ({ closeModal, actualizarMascotas }) => {
  const [files, setFiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("");
  const [color, setColor] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [organizacion, setOrganizacion] = useState(null);

  const [organizaciones, setOrganizaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [imagenPrevia, setImagenPrevia] = useState([]);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/categorias"); // Ajusta la URL según tu ruta
        const data = await response.json();

        // Actualiza el estado con las categorías obtenidas
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    obtenerCategorias();
  }, []);

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

  if (!token) {
    return <div>Redirecting...</div>;
  }

  const handleSeleccionOrganizacion = (selectedOrganization) => {
    setOrganizacion(selectedOrganization);
  };

  const handleSeleccionImagenes = (e) => {
    setFiles([...files, ...e.target.files]);
    setImagenPrevia([
      ...imagenPrevia,
      ...Object.values(e.target.files).map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleSubmit = async () => {
    try {
      if (!nombre || !raza || !categoria || !descripcion || !edad || !sexo) {
        console.error("Por favor, complete todos los campos obligatorios.");
        toast.error("Por favor, complete todos los campos obligatorios.");
        return;
      }
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

      const nuevaMascota = {
        nombre,
        raza,
        categoria,
        descripcion,
        edad,
        sexo,
        color,
        tamaño,
        fotos: promesasSubida,
        ubicacion,
        organizationId: organizacion.organizationId,
      };

      const responseNeo4j = await axios.post(
        "http://localhost:8800/api/pets/",
        nuevaMascota,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (responseNeo4j.status === 201) {
        console.log("Mascota creada exitosamente");
        actualizarMascotas();
        closeModal();
      } else {
        console.error(
          "Error al crear la mascota en Neo4j:",
          responseNeo4j.statusText
        );
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error.message);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Nuevo Usuario</h2>
      <button className="bg-greenP text-white py-2 px-4 rounded-md hover:bg-green1 font-bold transition-colors duration-300"
        onClick={closeModal}
        id="cerrarModal"
        >
        Cerrar Modal
      </button>
      <form className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id = "nombre"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Raza
          </label>
          <input
            type="text"
            id="raza"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            required
            id="categoria"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full text-black"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.tipo} value={cat.tipo}>
                {cat.tipo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            required
            id="descripcion"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Edad
          </label>
          <input
            required
            id="edad"
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={edad}
            onChange={(e) => {
              const nuevoValor = Math.max(0, parseInt(e.target.value, 10));
              setEdad(nuevoValor);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sexo
          </label>
          <select
            required
            id="sexo"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="">Selecciona un sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            required
            id="color"
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tamaño
          </label>
          <select
            required
            id="tamaño"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={tamaño}
            onChange={(e) => setTamaño(e.target.value)}
          >
            <option value="">Selecciona un tamaño</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fotos
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <input
            required
            id="ubicacion"
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organización
          </label>
          <select
            required
            id="organizacion"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={organizacion ? organizacion.organizationId : ""}
            onChange={(e) => {
              const selectedOrganization = organizaciones.find(
                (org) => org.organizationId === e.target.value
              );
              handleSeleccionOrganizacion(selectedOrganization);
            }}
          >
            <option value="">Selecciona una organización</option>
            {Array.isArray(organizaciones) &&
              organizaciones.map((org) => (
                <option key={org.organizationId} value={org.organizationId}>
                  {org.nombre}
                </option>
              ))}
          </select>
        </div>

        <button
          type="button"
          id="agregarMascotaButton"
          onClick={handleSubmit}
          className="col-span-2 bg-greenP text-white py-2 px-4 rounded-md hover:bg-green3 transition-colors duration-300"
        >
          Agregar Mascota
        </button>
        {/* <button
          type="button"
          onClick={handleClose()}
          className="col-span-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300"
        >
          Cerrar
        </button> */}
      </form>
      <Toaster/>
    </div>

  );
};

export default NuevaMascota;
