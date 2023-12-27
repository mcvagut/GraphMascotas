import React, {useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContexto";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleRegistrationChoice = (type) => {
    if(type === 'user') {
      navigate('/registro');
    } else if (type === 'organization') {
      navigate('/registroOrg');
    }
    setShowRegistrationModal(false); // Cerrar el modal después de la elección
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:8800/api/users/login", {
      usuario: username,
      password: password,
    });

    if (response && response.data.token) {
      const token = response.data.token;
      const organization = response.data.isOrganization; // Nuevo campo

      login(token);

      console.log("Inicio de sesión exitoso");
      toast.success("Inicio de sesión exitoso");

      setTimeout(() => {
        // Redirigir a la vista correspondiente
        if (organization) {
          navigate("/homeOrg");
        } else {
          navigate("/");
        }
      }, 2000);
    } else {
      console.error("Error al iniciar sesión: Respuesta no válida");
      toast.error("Error al iniciar sesión: Respuesta no válida");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    if (error.response && error.response.data && error.response.data.error) {
      const errorMessage = error.response.data.error;
      console.log("Actual error message:", errorMessage);
      toast.error(errorMessage);
    } else if (error.message) {
      console.log("Actual error message:", error.message);
      toast.error(error.message);
    } else {
      toast.error("Error al iniciar sesión");
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple to-purple2">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-2xl transform  flex flex-col items-center">
        <img
          className="w-20 h-20 mb-6"
          src="https://th.bing.com/th/id/OIG.y11hK2O_HSD9zpkbThlu?w=1024&h=1024&rs=1&pid=ImgDetMain"
          alt="Logo Mascota"
        />
        <h2 className="text-3xl font-bold text-purple-500 mb-8" >
          Iniciar Sesión
        </h2>
        <form className="w-full" onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-600 text-lg font-semibold mb-2"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-gray-600 text-lg font-semibold mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple text-lg text-white py-3 rounded hover:bg-purple2 transition duration-300 focus:outline-none"
            id="loginButton"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-5 text-lg text-gray-600">
          ¿Aún no tienes una cuenta?
          <a
            href="/"
            id="registerModalLink"
            onClick={(e) => {
              e.preventDefault();
              setShowRegistrationModal(true);
            }}
            className="text-purple ml-1 hover:underline"
          >
            Regístrate aquí
          </a>
        </p>
        {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center">
          <p className="text-lg font-semibold mb-4">¿Cómo quieres registrarte?</p>
          <button
            className="bg-redfav font-bold text-white px-4 py-2 rounded mr-2 hover:bg-redHover transition duration-300"
            id="registerUserButton"
            onClick={() => handleRegistrationChoice('user')}
          >
            Registrarse como Usuario
          </button>
          <button
            className="bg-orangefav font-bold text-white px-4 py-2 rounded hover:bg-orangeHover transition duration-300"
            id="registerOrganizationButton"
            onClick={() => handleRegistrationChoice('organization')}
          >
            Registrarse como Organización
          </button>
        </div>
      </div>
      )}
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
