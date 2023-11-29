import React, {useEffect} from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Header from '../../Components/Header/Header'
import { useAuth } from '../../context/AuthContexto';
import { useNavigate } from 'react-router-dom';

const Home = () => {
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
    return (
      <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Barra de encabezado */}
        <Header />

        {/* Contenido principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-8">
          {/* Contenido de la página */}
          <h1 className="text-3xl font-semibold mb-4">Bienvenido a la plataforma de adopción de mascotas</h1>
          <p className="text-gray-600">
            Encuentra a tu compañero peludo perfecto y bríndale un hogar lleno de amor.
          </p>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white shadow-lg rounded-lg px-4 py-6">
              <p className="text-xl font-semibold text-center mb-2">Mascotas</p>
              <p className="text-3xl text-center font-bold">10</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg px-4 py-6">
              <p className="text-xl font-semibold text-center mb-2">Adopciones</p>
              <p className="text-3xl text-center font-bold">0</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg px-4 py-6">
              <p className="text-xl font-semibold text-center mb-2">Organizaciones</p>
              <p className="text-3xl text-center font-bold">10</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg px-4 py-6">
              <p className="text-xl font-semibold text-center mb-2">Usuarios</p>
              <p className="text-3xl text-center font-bold">1000</p>
            </div>
          </div>
            
            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Mascotas por tamaño</h3>
                <canvas id="mascotasPorTamaño"></canvas>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Mascotas por edad</h3>
                <canvas id="mascotasPorEdad"></canvas>
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
              <h3 className="text-xl font-semibold mb-4">Últimas adopciones</h3>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Juan Pérez</td>
                    <td className="px-6 py-4 whitespace-nowrap">Firulais</td>
                    <td className="px-6 py-4 whitespace-nowrap">20/09/2021</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Juan Pérez</td>
                    <td className="px-6 py-4 whitespace-nowrap">Firulais</td>
                    <td className="px-6 py-4 whitespace-nowrap">20/09/2021</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Juan Pérez</td>
                    <td className="px-6 py-4 whitespace-nowrap">Firulais</td>
                    <td className="px-6 py-4 whitespace-nowrap">20/09/2021</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Juan Pérez</td>
                    <td className="px-6 py-4 whitespace-nowrap">Firulais</td>
                    <td className="px-6 py-4 whitespace-nowrap">20/09/2021</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-
                    nowrap">Juan Pérez</td>
                    <td className="px-6 py-4 whitespace-nowrap">Firulais</td>
                    <td className="px-6 py-4 whitespace-nowrap">20/09/2021</td>
                  </tr>
                </tbody>
              </table>
            </div>

            

        </main>
      </div>
    </div>
      );
}


export default Home