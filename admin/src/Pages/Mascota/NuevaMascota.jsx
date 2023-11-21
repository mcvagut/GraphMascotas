import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContexto';


const NuevaMascota = ({closeModal }) => {
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [color, setColor] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [fotos, setFotos] = useState([]);
  const [ubicacion, setUbicacion] = useState('');
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
        const response = await fetch('http://localhost:8800/api/categorias'); // Ajusta la URL según tu ruta
        const data = await response.json();

        // Actualiza el estado con las categorías obtenidas
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    obtenerCategorias();
  }, []);

  useEffect(() => {
    const obtenerOrganizaciones = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/rescueOrganizations/'); // Ajusta la URL según tu ruta
        const data = await response.json();
        setOrganizaciones(data);
      } catch (error) {
        console.error('Error al obtener organizaciones:', error);
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
    const archivos = e.target.files;
    const urls = [];
  
    for (let i = 0; i < archivos.length; i++) {
      const url = URL.createObjectURL(archivos[i]);
      urls.push(url);
    }
  
    setImagenPrevia(urls);
    setFotos(archivos);
  };
  

  const handleSubmit = async () => {
    try {
      // Subir imágenes a Cloudinary
      const formData = new FormData();
      for (let i = 0; i < fotos.length; i++) {
        formData.append('file', fotos[i]);
        formData.append('upload_preset', 'upload'); // Reemplaza 'tu-upload-preset' con tu configuración de Cloudinary
      }
  
      const responseCloudinary = await axios.post(
        'https://api.cloudinary.com/v1_1/dwwj8mhse/image/upload', // Reemplaza 'tu-cloud-name' con tu nombre de nube de Cloudinary
        formData
      );
  
      if (responseCloudinary.status === 200) {
        const imagenesCargadas = responseCloudinary.data.resources
        ? responseCloudinary.data.resources.map((resource) => resource.secure_url)
        : [];
        console.log('Enlaces de imágenes cargadas:', imagenesCargadas);
  
        // Crear la mascota en la base de datos Neo4j utilizando tu función createPet
        const responseNeo4j = await fetch('http://localhost:8800/api/pets/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            nombre,
            raza,
            categoria,
            descripcion,
            edad,
            sexo,
            color,
            tamaño,
            fotos: imagenesCargadas,
            ubicacion,
            organizationId: organizacion.organizationId, // Asegúrate de tener organizacionId disponible
          }),
        });
  
        if (responseNeo4j.ok) {
          // Manejar la respuesta exitosa, como cerrar el modal o redirigir a otra página
          console.log('Mascota creada exitosamente');
          closeModal();
        } else {
          // Manejar errores de la respuesta de Neo4j
          console.error('Error al crear la mascota en Neo4j:', responseNeo4j.statusText);
        }
      } else {
        // Manejar errores de la respuesta de Cloudinary
        console.error('Error al cargar imágenes a Cloudinary:', responseCloudinary.statusText);
      }
    } catch (error) {
      // Manejar errores durante el proceso
      console.error('Error al procesar la solicitud:', error.message);
    }
  };
  

  return (
    <div className="mx-auto p-4 max-w-screen-md">
      <form className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Raza</label>
          <input
            type="text"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            required
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
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
          required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Edad</label>
          <input
          required
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
          <label className="block text-sm font-medium text-gray-700">Sexo</label>
          <select
          required
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
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <input
          required
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tamaño</label>
          <select
          required
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
  <label className="block text-sm font-medium text-gray-700">Fotos</label>
  <input
    required
    type="file"
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
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <input
          required
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700">Organización</label>
  <select
  required
  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
  value={organizacion ? organizacion.organizationId : ''}
  onChange={(e) => {
    const selectedOrganization = organizaciones.find(org => org.organizationId === e.target.value);
    handleSeleccionOrganizacion(selectedOrganization);
  }}
>
  <option value="">Selecciona una organización</option>
  {organizaciones.map((org) => (
    <option key={org.organizationId} value={org.organizationId}>
      {org.nombre}
    </option>
  ))}
</select>
</div>


        <button
          type="button"
          onClick={handleSubmit}
          className="col-span-2 bg-greenP text-white py-2 px-4 rounded-md hover:bg-green3 transition-colors duration-300"
        >
          Agregar Mascota
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="col-span-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300"
        >
          Cerrar
        </button>
      </form>
    </div>
  );
};

export default NuevaMascota;