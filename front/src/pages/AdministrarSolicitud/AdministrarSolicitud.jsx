import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";
import { useRef } from "react";
import { useAuth } from "../../context/AuthContexto";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar2 from "../../components/Sidebar/Sidebar2";
import Footer from "../../components/Footer/Footer";

const AdministrarSolicitud = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [, setSocket] = useState(null);
  const socketRef = useRef(null);

  const { getOrganizationId } = useAuth();
  const organizationId = getOrganizationId();

  console.log("Qué recibo en solicitudes?", solicitudes);

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
  }, []);

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
        <h1 className="text-2xl font-bold mb-4">
  Administrar Solicitudes de Adopción
</h1>
{
  solicitudes.length > 0 ? (
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
                onClick={() =>
                  handleAceptar(solicitud.mascotaId, solicitud.usuario)
                }
              >
                Aceptar
              </button>
              <button
                className="bg-redfav hover:bg-red-600 text-white py-1 px-2 rounded transition duration-300"
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
  )
}
        </main>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default AdministrarSolicitud;

