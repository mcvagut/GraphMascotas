import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../context/AuthContexto";

const Solicitudes = () => {
  const { usuario } = useAuth();
  const us = usuario();
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [, setMascotasAdoptadas] = useState([]);
  const [, setMascotasRechazadas] = useState([]);

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

  // useEffect(() => {
  //   const obtenerMascotasAdoptadas = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8800/api/users/solicitudes-adopcion/${us.usuario}`
  //       );

  //       // Extraer la información de cada mascota adoptada
  //       const mascotasAdoptadas = res.data.map(
  //         (item) => item.mascota.properties
  //       );

  //       // Actualizar el estado con las mascotas adoptadas extraídas
  //       setMascotasAdoptadas(mascotasAdoptadas);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Error al obtener las mascotas adoptadas");
  //     }
  //   };

  //   obtenerMascotasAdoptadas(); // Mover esta línea fuera del bloque try-catch
  // }, [us.usuario]);

  // useEffect(() => {
  //   const obtenerRechazados = async () => {
  //     try {
  //       const res = await axios.get(
  //         `http://localhost:8800/api/users/solicitudes-rechazadas/${us.usuario}`
  //       );

  //       console.log("Respuesta de mascotas rechazadas:", res.data);

  //       // Verificar si res.data es un array antes de mapear
  //       const mascotasRechazadas = Array.isArray(res.data)
  //         ? await Promise.all(
  //             res.data
  //               .filter((item) => item.historial) // Filtrar elementos con historial definido
  //               .map(async (item) => {
  //                 // Acceder a las propiedades de historial
  //                 const { estadoAdopcion, fechaRechazo, mascotaId, usuario } =
  //                   item.historial;

  //                 // Hacer otra solicitud para obtener más detalles de la mascota
  //                 const respuestaDetalles = await axios.get(
  //                   `http://localhost:8800/api/pets/${mascotaId}`
  //                 );
  //                 console.log(
  //                   "Respuesta de mascotas rechazadassss:",
  //                   respuestaDetalles.data
  //                 );
  //                 // Devolver un objeto combinado con detalles adicionales
  //                 return {
  //                   estadoAdopcion,
  //                   fechaRechazo,
  //                   mascotaId,
  //                   usuario,
  //                   detallesMascota: respuestaDetalles.data, // Aquí asumo que la respuesta contiene detalles adicionales
  //                 };
  //               })
  //           )
  //         : [];

  //       // Actualizar el estado con las mascotas rechazadas extraídas
  //       setMascotasRechazadas(mascotasRechazadas);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Error al obtener las mascotas rechazadas");
  //     }
  //   };

  //   obtenerRechazados(); // Mover esta línea fuera del bloque try-catch
  // }, [us.usuario]);

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
            {/** Solicitudes Pendientes */}
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(solicitudesPendientes) &&
              solicitudesPendientes.length > 0 ? (
                solicitudesPendientes.map(
                  (pendientes) => (
                    (
                      <tr key={pendientes.id}>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          <img
                            src={pendientes.fotos[0]}
                            alt={pendientes.nombre}
                            className="object-cover rounded-md w-full h-32"
                          />
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {pendientes.nombre}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {pendientes.edad}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {pendientes.color}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {pendientes.tamaño}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          {pendientes.raza}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center font-extrabold text-xl text-orangefav">
                          {pendientes.estadoAdopcion}
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
                    No tienes solicitudes de adopción pendientes.
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

export default Solicitudes;
