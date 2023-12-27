import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    pais: "",
    ciudad: "",
    telefono: "",
    fecha_nacimiento: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/users/registro",
        formData
      );

      if (response && response.data) {
        // Registration successful
        toast.success("Registro exitoso");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        // You can redirect the user to the login page or any other page
      }
    } catch (error) {
      console.error(
        "Error al registrar:",
        error.response ? error.response.data.error : error.message
      );
      const errorMessage = error.response
        ? error.response.data.error
        : "Error al registrar";

      switch (errorMessage) {
        case "El usuario o email ya está registrado.":
          toast.error("El usuario o email ya está registrado.");
          break;
        // Handle other registration errors as needed
        default:
          toast.error("Error al registrar");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple to-purple2">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-2xl transform  flex flex-col items-center">
        <img
          className="w-20 h-20 mb-2"
          src="https://th.bing.com/th/id/OIG.y11hK2O_HSD9zpkbThlu?w=1024&h=1024&rs=1&pid=ImgDetMain"
          alt="Logo Mascota"
        />
        <h2 className="text-3xl font-bold text-purple2 mb-8">Registro</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="nombre"
                className="block text-gray-600 text-sm font-semibold mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div>
              <label
                htmlFor="apellido"
                className="block text-gray-600 text-sm font-semibold mb-1"
              >
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-semibold mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          <div>
            <label
              htmlFor="usuario"
              className="block text-gray-600 text-sm font-semibold mb-1"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm font-semibold mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="pais"
                className="block text-gray-600 text-sm font-semibold mb-1"
              >
                País
              </label>
              <input
                type="text"
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
                placeholder="Ingresa tu país"
                required
              />
            </div>
            <div>
              <label
                htmlFor="ciudad"
                className="block text-gray-600 text-sm font-semibold mb-1"
              >
                Ciudad
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
                placeholder="Ingresa tu ciudad"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="telefono"
              className="block text-gray-600 text-sm font-semibold mb-1"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              placeholder="Ingresa tu número de teléfono"
              required
            />
          </div>

          <div>
            <label
              htmlFor="fecha_nacimiento"
              className="block text-gray-600 text-sm font-semibold mb-1"
            >
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple2 mb-3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple text-white py-3 rounded hover:bg-purple2 transition duration-300 focus:outline-none mt-6"
            id="submit"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-5 text-xl text-gray-600">
          ¿Ya tienes una cuenta?
          <Link
            to="/login"
            className="text-purple ml-1 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;
