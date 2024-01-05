import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContexto';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8800/api/users/loginAdmin', {
        usuario: username,
        password: password,
      });
  
      if (response && response.data.token) {
        const token = response.data.token;
        login(token);
        console.log('Inicio de sesión exitoso');
        toast.success('Inicio de sesión exitoso');
        setTimeout(() => {
          navigate('/');
          }, 2000);
      } else {
        console.error('Error al iniciar sesión: Respuesta no válida');
        toast.error('Error al iniciar sesión: Respuesta no válida');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
  
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        console.log('Actual error message:', errorMessage);
        toast.error(errorMessage);
      } else if (error.message) {
        console.log('Actual error message:', error.message);
        toast.error(error.message);
      } else {
        toast.error('Error al iniciar sesión');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
    <div className="bg-green3 p-8 rounded-lg shadow-md w-96">
      <h2 className="text-3xl font-bold mb-4 text-green1">Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-lg text-black mb-2">Usuario</label>
          <input
            type="text"
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-black rounded-md focus:outline-none focus:border-greenP"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg text-black mb-2">Contraseña</label>
          <input
            type="password"
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-black rounded-md focus:outline-none focus:border-greenP"
            required
          />
        </div>
        <button
          type="submit"
          id='loginButton'
          className="w-full p-3 bg-black text-white font-bold rounded-md hover:bg-green1 transition-colors duration-300"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
    <Toaster />
  </div>
);
};

export default Login;