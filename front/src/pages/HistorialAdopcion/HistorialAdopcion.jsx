import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContexto";

const HistorialAdopcion = () => {
  const { usuario } = useAuth();
  const us = usuario();
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [mascotasAdoptadas, setMascotasAdoptadas] = useState([]);
  const [mascotasRechazadas, setMascotasRechazadas] = useState([]);

  useEffect(() => {
    const obtenerSolicitudesPendientes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/users/solicitudes-pendientes/${us.usuario}`
        );

        // Extraer la información de cada mascota
        const mascotas = response.data.map((item) => item.mascota.properties);

        // Actualizar el estado con las mascotas extraídas
        setSolicitudesPendientes(mascotas);
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener las solicitudes pendientes");
      }
    };

    obtenerSolicitudesPendientes(); // Mover esta línea fuera del bloque try-catch
  }, [us.usuario]);

  useEffect(() => {
    const obtenerMascotasAdoptadas = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users/solicitudes-adopcion/${us.usuario}`
        );

        // Extraer la información de cada mascota adoptada
        const mascotasAdoptadas = res.data.map(
          (item) => item.mascota.properties
        );

        // Actualizar el estado con las mascotas adoptadas extraídas
        setMascotasAdoptadas(mascotasAdoptadas);
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener las mascotas adoptadas");
      }
    };

    obtenerMascotasAdoptadas(); // Mover esta línea fuera del bloque try-catch
  }, [us.usuario]);

  useEffect(() => {
    const obtenerRechazados = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users/solicitudes-rechazadas/${us.usuario}`
        );

        console.log("Respuesta de mascotas rechazadas:", res.data);

        // Verificar si res.data es un array antes de mapear
        const mascotasRechazadas = Array.isArray(res.data)
          ? await Promise.all(
              res.data
                .filter((item) => item.historial) // Filtrar elementos con historial definido
                .map(async (item) => {
                  // Acceder a las propiedades de historial
                  const { estadoAdopcion, fechaRechazo, mascotaId, usuario } =
                    item.historial;

                  // Hacer otra solicitud para obtener más detalles de la mascota
                  const respuestaDetalles = await axios.get(
                    `http://localhost:8800/api/pets/${mascotaId}`
                  );
                  console.log(
                    "Respuesta de mascotas rechazadassss:",
                    respuestaDetalles.data
                  );
                  // Devolver un objeto combinado con detalles adicionales
                  return {
                    estadoAdopcion,
                    fechaRechazo,
                    mascotaId,
                    usuario,
                    detallesMascota: respuestaDetalles.data, // Aquí asumo que la respuesta contiene detalles adicionales
                  };
                })
            )
          : [];

        // Actualizar el estado con las mascotas rechazadas extraídas
        setMascotasRechazadas(mascotasRechazadas);
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener las mascotas rechazadas");
      }
    };

    obtenerRechazados(); // Mover esta línea fuera del bloque try-catch
  }, [us.usuario]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-4">Solicitudes de Adopción</h1>
          <table className="mx-46 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Imagen
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Edad
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Color
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Tamaño
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Raza
                </th>
                <th
                  scope="col"
                  className="px-8 py-3 text-left text-xl font-extrabold text-gray-500 uppercase tracking-wider text-center"
                >
                  Estado de Adopción
                </th>
              </tr>
            </thead>
            {/** Mascotas Adoptadas */}
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(mascotasAdoptadas) &&
              mascotasAdoptadas.length > 0 ? (
                mascotasAdoptadas.map(
                  (adoptadas) => (
                    (
                      <tr key={adoptadas.id}>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          <img
                            src={adoptadas.fotos[0]}
                            alt={adoptadas.nombre}
                            className="object-cover rounded-md w-full h-32"
                          />
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {adoptadas.nombre}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {adoptadas.edad}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {adoptadas.color}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {adoptadas.tamaño}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {adoptadas.raza}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center font-extrabold text-xl text-greenfav">
                          {adoptadas.estadoAdopcion}
                        </td>
                      </tr>
                    )
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-8 py-4 whitespace-nowrap text-center"
                  >
                    No tienes solicitudes de adopción aceptadas.
                  </td>
                </tr>
              )}
            </tbody>
            {/** Mascotas Rechazadas */}
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(mascotasRechazadas) &&
              mascotasRechazadas.length > 0 ? (
                mascotasRechazadas.map((historial) => (
                  <tr key={historial.mascotaId}>
                    <td className="px-8 py-4 whitespace-nowrap text-center">
                      {/* Puedes mostrar la información de la mascota utilizando las propiedades */}
                      <img
                        src={historial.detallesMascota.fotos[0]}
                        alt={historial.detallesMascota.nombre}
                        className="object-cover rounded-md w-full h-32"
                      />
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center">
                      {historial.detallesMascota.nombre}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center">
                      {historial.detallesMascota.edad}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center">
                      {historial.detallesMascota.color}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center">
                      {historial.detallesMascota.tamaño}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center">
                      {historial.detallesMascota.raza}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-center font-extrabold text-xl text-redfav">
                      <span>{historial.estadoAdopcion}</span>
                    </td>
                    {/* Agrega más columnas según sea necesario para mostrar la información */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-8 py-4 whitespace-nowrap text-center"
                  >
                    No tienes solicitudes de adopción rechazadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default HistorialAdopcion;
