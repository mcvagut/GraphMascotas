import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import { useRef } from "react";
import { useAuth } from "../../context/AuthContexto";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar2 from "../../components/Sidebar/Sidebar2";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const AdministrarSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [, setSocket] = useState(null);
  const [mascotaInfo, setMascotasInfo] = useState(null);
  const [usuariosInfo, setUsuariosInfo] = useState(null);
  const socketRef = useRef(null);

  const { getOrganizationId } = useAuth();
  const organizationId = getOrganizationId();

  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io("http://localhost:8800");
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Socket conectado");
      newSocket.emit("prueba", "Hola desde el frontend");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      console.log("Socket cerrado");
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("notificacion", (data) => {
        console.log("Notificación recibida en HomeOrg:", data);
        toast.success(data.mensaje);
      });
    }
  }, []);

  // Antes del componente, puedes realizar la solicitud al servidor para obtener la información de todas las mascotas
  useEffect(() => {
    const obtenerInformacionDeMascotas = async () => {
      try {
        const mascotaIds = solicitudes.map((solicitud) => solicitud.mascotaId);

        // Enviar la lista de mascotaIds al servidor y obtener información de las mascotas
        const response = await axios.get(
          `http://localhost:8800/api/pets/${mascotaIds}`
        );
        const mascotasInfo = response.data; // Supongamos que el servidor devuelve la información de las mascotas

        // Actualizar el estado con la información de las mascotas
        setMascotasInfo(mascotasInfo);

        // Aquí puedes manejar la respuesta del servidor
        console.log("Respuesta del servidor para mascotas:", response.data);
      } catch (error) {
        // Manejar errores en caso de que la solicitud falle
        console.error("Error al obtener información de mascotas:", error);
      }
    };

    obtenerInformacionDeMascotas();
  }, [solicitudes]); // Dependencia para que la solicitud se realice cada vez que cambie el array de solicitudes

  // Antes del componente, puedes realizar la solicitud al servidor para obtener la información de todas las mascotas
  useEffect(() => {
    const obtenerInformacionDeUsuarios = async () => {
      try {
        const usuarios = solicitudes.map((solicitud) => solicitud.usuario);

        // Enviar la lista de usuarios al servidor y obtener información de las mascotas
        const response = await axios.get(
          `http://localhost:8800/api/users/${usuarios}`
        );
        const usuariosInfo = response.data; // Supongamos que el servidor devuelve la información de las mascotas

        // Actualizar el estado con la información de las mascotas
        setUsuariosInfo(usuariosInfo);

        // Aquí puedes manejar la respuesta del servidor
        console.log("Respuesta del servidor para usuarios:", response.data);
      } catch (error) {
        // Manejar errores en caso de que la solicitud falle
        console.error("Error al obtener información de usuario:", error);
      }
    };
    obtenerInformacionDeUsuarios();
  }, [solicitudes]); // Dependencia para que la solicitud se realice cada vez que cambie el array de solicitudes

  useEffect(() => {
    // Realiza la solicitud al backend para obtener las solicitudes de adopción
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/rescueOrganizations/adopcion/obtener-solicitudes/${organizationId}`
        );
        setSolicitudes(response.data);
      } catch (error) {
        console.error("Error al obtener las solicitudes de adopción:", error);
        // Puedes manejar el error de acuerdo a tus necesidades
      }
    };

    fetchData();
  }, [organizationId]);

  const handleAceptar = async (mascotaId, usuario) => {
    try {
      console.log("Enviando solicitud de aceptar:", { usuario, mascotaId });
      await axios.post(
        "http://localhost:8800/api/rescueOrganizations/adopcion/gestionar-solicitud",
        {
          usuario,
          mascotaId,
          aceptar: true,
        }
      );
      toast.success("Solicitud de adopción aceptada correctamente.");
      setTimeout(() => {
        navigate("/homeOrg");
      }, 2000);
      console.log("Solicitud de aceptar enviada correctamente.");
    } catch (error) {
      console.error("Error al aceptar la solicitud de adopción:", error);
      // Puedes manejar el error de acuerdo a tus necesidades
    }
  };

  const handleRechazar = async (mascotaId, usuario) => {
    try {
      console.log("Enviando solicitud de rechazar:", { usuario, mascotaId });
      await axios.post(
        "http://localhost:8800/api/rescueOrganizations/adopcion/gestionar-solicitud",
        {
          usuario,
          mascotaId,
          aceptar: false,
        }
      );
      toast.success("Solicitud de adopción rechazada correctamente.");
      setTimeout(() => {
        navigate("/homeOrg");
      }, 2000);
      console.log("Solicitud de rechazar enviada correctamente.");
    } catch (error) {
      console.error("Error al rechazar la solicitud de adopción:", error);
      // Puedes manejar el error de acuerdo a tus necesidades
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar2 />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Administrar Solicitudes de Adopción
          </h1>
          {solicitudes.length > 0 ? (
            <table className="min-w-full bg-white border border-collapse border-gray-300 shadow-md rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 w-1/6 text-xl text-purple2">
                    Usuario Solicitante
                  </th>
                  <th className="border p-4 text-xl text-purple2">
                    Información sobre la Mascota
                  </th>
                  <th className="border p-4 w-1/6 text-xl text-purple2">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((solicitud) => (
                  <tr key={solicitud.mascotaId} className="hover:bg-gray-50">
                    <td className="border p-4">
                      {usuariosInfo && (
                        <div>
                          <p className="mt-2">
                            <strong>Nombre: </strong>
                            {usuariosInfo.nombre} {usuariosInfo.apellido}
                          </p>
                          <p>
                            <strong>Telefono: </strong>
                            {usuariosInfo.telefono}
                          </p>
                          <p>
                            <strong>Email: </strong>
                            {usuariosInfo.email}
                          </p>
                          <p>
                            <strong>Ciudad: </strong>
                            {usuariosInfo.ciudad}
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="border p-4">
                      {mascotaInfo &&
                        mascotaInfo.fotos &&
                        mascotaInfo.fotos[0] && (
                          <div>
                            <img
                              src={mascotaInfo.fotos[0]}
                              alt={mascotaInfo.nombre}
                              className="object-cover rounded-md w-full h-32"
                            />
                            <p className="mt-2">
                              <strong>Nombre: </strong>
                              {mascotaInfo.nombre}
                            </p>
                            <p>
                              <strong>Raza: </strong>
                              {mascotaInfo.raza}
                            </p>
                          </div>
                        )}
                    </td>

                    <td className="mt-12 flex items-center justify-center space-y-2 flex-col">
                      <button
                        id="acceptButton"
                        className="bg-orangefav hover:bg-orangeHover font-bold text-white py-2 px-4 rounded transition duration-300"
                        onClick={() =>
                          handleAceptar(solicitud.mascotaId, solicitud.usuario)
                        }
                      >
                        Aceptar
                      </button>
                      <div className="h-2"></div>{" "}
                      {/* Espacio vertical entre los botones */}
                      <button
                        id="rejectButton"
                        className="bg-redfav hover:bg-redHover font-bold text-white py-2 px-4 rounded transition duration-300"
                        onClick={() =>
                          handleRechazar(solicitud.mascotaId, solicitud.usuario)
                        }
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
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default AdministrarSolicitud;
