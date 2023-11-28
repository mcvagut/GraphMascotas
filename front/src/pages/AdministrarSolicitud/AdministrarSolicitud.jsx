import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdministrarSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    // Realiza la solicitud al backend para obtener las solicitudes de adopción
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/rescueOrganizations/adopcion/obtener-solicitudes/5cadbc4d-c50d-4de9-89dc-53aee4a9132a');
        setSolicitudes(response.data);
      } catch (error) {
        console.error('Error al obtener las solicitudes de adopción:', error);
        // Puedes manejar el error de acuerdo a tus necesidades
      }
    };

    fetchData();
  }, []);

  const handleAceptar = async (mascotaId, usuario) => {
    try {
      console.log('Enviando solicitud de aceptar:', { usuario, mascotaId });
      await axios.post('http://localhost:8800/api/rescueOrganizations/adopcion/gestionar-solicitud', {
        usuario,
        mascotaId,
        aceptar: true,
      });
      console.log('Solicitud de aceptar enviada correctamente.');
    } catch (error) {
      console.error('Error al aceptar la solicitud de adopción:', error);
      // Puedes manejar el error de acuerdo a tus necesidades
    }
  };

  const handleRechazar = async (mascotaId, usuario) => {
    try {
      console.log('Enviando solicitud de rechazar:', { usuario, mascotaId });
      await axios.post('http://localhost:8800/api/rescueOrganizations/adopcion/gestionar-solicitud', {
        usuario,
        mascotaId,
        aceptar: false,
      });
      console.log('Solicitud de rechazar enviada correctamente.');
    } catch (error) {
      console.error('Error al rechazar la solicitud de adopción:', error);
      // Puedes manejar el error de acuerdo a tus necesidades
    }
  };

  return (
    <div className="mt-8">
  <h1 className="text-2xl font-bold mb-4">Administrar Solicitudes de Adopción</h1>
  {solicitudes.length > 0 ? (
    <table className="min-w-full border border-collapse border-gray-300">
      <thead>
        <tr>
          <th className="border p-2">Usuario</th>
          <th className="border p-2">Mascota ID</th>
          <th className="border p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {solicitudes.map((solicitud) => (
          <tr key={solicitud.mascotaId}>
            <td className="border p-2">{solicitud.usuario}</td>
            <td className="border p-2">{solicitud.mascotaId}</td>
            <td className="border p-2 flex space-x-2">
              <button
                className="bg-orangefav hover:bg-greenP text-white py-1 px-2 rounded transition duration-300"
                onClick={() => handleAceptar(solicitud.mascotaId, solicitud.usuario)}
              >
                Aceptar
              </button>
              <button
                className="bg-redfav hover:bg-red-600 text-white py-1 px-2 rounded transition duration-300"
                onClick={() => handleRechazar(solicitud.mascotaId, solicitud.usuario)}
              >
                Rechazar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="mt-4">No hay solicitudes de adopción pendientes.</p>
  )}
</div>

  );
};

export default AdministrarSolicitud;
