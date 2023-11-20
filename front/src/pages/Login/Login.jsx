import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple to-purple2">
      <div className="bg-white p-16 rounded-lg shadow-lg w-full max-w-2xl transform  flex flex-col items-center">
        <img className="w-20 h-20 mb-6" src='https://th.bing.com/th/id/OIG.y11hK2O_HSD9zpkbThlu?w=1024&h=1024&rs=1&pid=ImgDetMain' alt='Logo Mascota'/>
        <h2 className="text-3xl font-bold text-purple-500 mb-8">Iniciar Sesión</h2>
        <form className="w-full">
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-600 text-lg font-semibold mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-gray-600 text-lg font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple text-lg text-white py-3 rounded hover:bg-purple2 transition duration-300 focus:outline-none"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-5 text-lg text-gray-600">
          ¿Aún no tienes una cuenta?
          <a href="#" className="text-purple ml-1 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
