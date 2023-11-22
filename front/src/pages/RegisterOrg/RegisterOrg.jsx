import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterOrg = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    email: '',
    descripcion: '',
    fechaFundacion: '',
    nombre: '',
    ciudad: '',
    calle: '',
    telefono: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8800/api/rescueOrganizations/registroOrg', formData);

      if (response && response.data) {
        // Registration successful
        toast.success('Registro exitoso');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        // Puedes redirigir al usuario a la página de inicio de sesión o a cualquier otra página.
      }
    } catch (error) {
      console.error('Error al registrar:', error.response ? error.response.data.error : error.message);
      const errorMessage = error.response ? error.response.data.error : 'Error al registrar';

      switch (errorMessage) {
        case 'El usuario o email ya está registrado.':
          toast.error('El usuario o email ya está registrado.');
          break;
        // Maneja otros errores de registro según sea necesario
        default:
          toast.error('Error al registrar');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple to-purple2">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-2xl transform  flex flex-col items-center">
        <img
          className="w-20 h-20 mb-2"
          src='https://th.bing.com/th/id/OIG.y11hK2O_HSD9zpkbThlu?w=1024&h=1024&rs=1&pid=ImgDetMain'
          alt='Logo Mascota'
        />
        <h2 className="text-3xl font-bold text-purple2 mb-8">Registro de Organización</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Campos del formulario de organización */}
          <div>
            <label htmlFor="usuario" className="block text-gray-600 text-sm font-semibold mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa el nombre de usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 text-sm font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa la contraseña"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600 text-sm font-semibold mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa el correo electrónico"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-gray-600 text-sm font-semibold mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa una breve descripción"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="fechaFundacion" className="block text-gray-600 text-sm font-semibold mb-1">
              Fecha de Fundación
            </label>
            <input
              type="date"
              id="fechaFundacion"
              name="fechaFundacion"
              value={formData.fechaFundacion}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              required
            />
          </div>

          <div>
            <label htmlFor="nombre" className="block text-gray-600 text-sm font-semibold mb-1">
              Nombre de la Organización
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa el nombre de la organización"
              required
            />
          </div>

          <div>
            <label htmlFor="ciudad" className="block text-gray-600 text-sm font-semibold mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa la ciudad"
              required
            />
          </div>

          <div>
            <label htmlFor="calle" className="block text-gray-600 text-sm font-semibold mb-1">
              Calle
            </label>
            <input
              type="text"
              id="calle"
              name="calle"
              value={formData.calle}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa la calle"
              required
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-gray-600 text-sm font-semibold mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa el número de teléfono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple text-white py-3 rounded hover:bg-purple2 transition duration-300 focus:outline-none mt-6"
          >
            Registrarse
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default RegisterOrg;
