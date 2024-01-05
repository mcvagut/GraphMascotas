import neo4j from "neo4j-driver";
import RescueOrganization from "../models/RescueOrganization.js";
import AdoptionRequest from "../models/AdoptionRequest.js";
import AdoptionHistory from "../models/AdoptionHistory.js";
import TrackAdoption from "../models/TrackAdoption.js";
import Pet from "../models/Pet.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { socketsPorUsuario } from "../index.js";

dotenv.config();

// Creación de la sesión
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session(process.env.NEO4J_DATABASE);

const rescueOrganization = new RescueOrganization(session);

export const createRescueOrganization = async (req, res) => {
  const session = driver.session();
  try {
    const {
      nombre,
      descripcion,
      email,
      calle,
      ciudad,
      usuario,
      password,
      telefono,
      fechaFundacion,
    } = req.body;

    if (
      !nombre ||
      !descripcion ||
      !fechaFundacion
    ) {
      return res.status(400).json({ error: "Faltan propiedades obligatorias" });
    }
    const id = uuidv4();

    const organizationProperties = {
      organizationId: id,
      calle,
      email,
      usuario,
      password,
      ciudad,
      telefono,
      nombre,
      descripcion,
      fechaFundacion,
      estado: "Activa",
      isOrganization: true,
      isAdmin: false,
    };

    const newOrganization = await rescueOrganization.createRescueOrganization(
      organizationProperties
    );

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al crear la organización de rescate" });
  } finally {
    session.close();
  }
};

export const updateRescueOrganization = async (req, res) => {
  const session = driver.session();
  try {
    const { organizationId } = req.params;
    const updatedProperties = req.body;

    const foundOrg = await rescueOrganization.findRescueOrganizationById(organizationId);

    if (!foundOrg) {
      return res
        .status(404)
        .json({ error: "Organización de rescate no encontrada" });
    }
    const updatedOrganization =
      await rescueOrganization.updateRescueOrganization(
        organizationId,
        updatedProperties
      );
    res.status(200).json(updatedOrganization);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al actualizar la organización de rescate" });
  } finally {
    session.close();
  }
};

export const getRescueOrganizationByUUID = async (req, res) => {
  const session = driver.session();
  try {
    const rescueOrganization = new RescueOrganization(session);
    const { organizationId } = req.params; // Suponiendo que el UUID se pasa como parámetro en la URL

    const organization = await rescueOrganization.findRescueOrganizationById(organizationId);

    if (organization) {
      res.json(organization);
    } else {
      res.status(404).json({ error: "Organización de rescate no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener la organización de rescate" });
  } finally {
    session.close();
  }
};

export const getAllRescueOrganizations = async (req, res) => {
  const session = driver.session();
  try {
    const organizations = await rescueOrganization.findAllRescueOrganizations();

    res.json(organizations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener las organizaciones de rescate" });
  } finally {
    session.close();
  }
};

export const deleteRescueOrganizationByUUID = async (req, res) => {
  const session = driver.session();
  try {
    const rescueOrganization = new RescueOrganization(session);
    const { organizationId } = req.params; // Suponiendo que el UUID se pasa como parámetro en la URL

    await rescueOrganization.deleteRescueOrganization(organizationId);

   res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar la organización de rescate" });
  } finally {
    session.close();
  }
};

export const addPetToAdoptionList = async (req, res) => {
  const session = driver.session();

  try {
    const organization = new RescueOrganization(session);
    const pet = new Pet(session);

    const { organizationId, uuid, estadoAdopcion } = req.body;

    const orgNode = await organization.findOnlyById(organizationId);
    const petNode = await pet.findOnlyByUUID(uuid, estadoAdopcion);

    if (!orgNode) {
      return res
        .status(404)
        .json({ error: "Organización de rescate no encontrada" });
    }
    if (!petNode) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    await organization.addPetToAdoptionList(orgNode, petNode);

    res
      .status(200)
      .json({ message: "Mascota puesta en Adopción Exitósamente!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al agregar la mascota a la lista de adopción" });
  }
  finally {
    session.close();
  }
};

// export const gestionarSolicitudesAdopcion = async (req, res) => {
//   const session = driver.session();
//   const io = req.app.get('io');

//   try {
//     const { usuario, mascotaId, aceptar } = req.body;
//     const adoptionRequest = new AdoptionRequest(session);
//     const adoptionHistory = new AdoptionHistory(session);
//     const trackingAdoption = new TrackAdoption(session);
//     const mascota = new Pet(session);

//     const mascotaAdoptada = await adoptionRequest.verificarMascotaAdoptada(mascotaId);

//   if (mascotaAdoptada) {
//     return res.status(400).json({ error: 'Esta mascota ya ha sido adoptada' });
//   }

//   const existeMascota = await mascota.findOnlyByUUID(mascotaId);
//   if (!existeMascota) {
//     return res.status(400).json({ error: 'Esta mascota no existe' });
//   }

//   const infoMascota = await mascota.findOrganizationIdByUUID(mascotaId);
//   const organizationId = infoMascota.organizationId;

//   if (!organizationId) {
//       return res.status(400).json({ error: 'No se pudo obtener el organizationId de la mascota' });
//   }

//   colaSolicitudes.push({ usuario, mascotaId, aceptar });
//   await adoptionRequest.gestionarSolicitudAdopcion(usuario, mascotaId, aceptar);

//   if (aceptar) {
//     const fechaAdopcion = new Date().toISOString();
//     await adoptionHistory.createAdoptionRecord(usuario, mascotaId, fechaAdopcion);
//     await trackingAdoption.createAdoptionTracking(usuario, mascotaId, organizationId, fechaAdopcion);

//     // Emitir notificación al usuario que solicitó la adopción
//     io.to(usuario).emit('notificacion', { mensaje: '¡Felicidades! Tu solicitud de adopción ha sido aceptada.' });
//   } else {
//     // Emitir notificación al usuario que solicitó la adopción
//     io.to(usuario).emit('notificacion', { mensaje: 'Lamentablemente, tu solicitud de adopción ha sido rechazada.' });
//   }

//     res.status(200).json({ message: 'Solicitud de adopción gestionada exitosamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al gestionar la solicitud de adopción' });
//   } finally {
//     session.close();
//   }
// };

const colaSolicitudes = [];

export const gestionarSolicitudesAdopcion = async (req, res) => {
  const session = driver.session();

  try {
    const { usuario, mascotaId, aceptar } = req.body;

    const adoptionRequest = new AdoptionRequest(session);
    const mascotaAdoptada = await adoptionRequest.verificarMascotaAdoptada(mascotaId);

    if (mascotaAdoptada) {
      return res.status(400).json({ error: 'Esta mascota ya ha sido adoptada' });
    }
    colaSolicitudes.push({ usuario, mascotaId, aceptar });


    await procesarColaSolicitudes(req.app.get('io'));

    res.status(200).json({ message: 'Solicitud de adopción gestionada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al gestionar la solicitud de adopción' });
  } finally {
    session.close();
  }
};


export const procesarColaSolicitudes = async (io) => {
  const session = driver.session();

  try {
    while (colaSolicitudes.length > 0) {
      const { usuario, mascotaId, aceptar } = colaSolicitudes.shift();
      console.log("USUARIO.USAURIO", usuario)

      const adoptionRequest = new AdoptionRequest(session);
      const adoptionHistory = new AdoptionHistory(session);
      const trackingAdoption = new TrackAdoption(session);
      const mascota = new Pet(session);


      const mascotaAdoptada = await adoptionRequest.verificarMascotaAdoptada(mascotaId);

      if (mascotaAdoptada) {
        console.error("Esta mascota ya ha sido adoptada");
        continue; 
      }

      const existeMascota = await mascota.findOnlyByUUID(mascotaId);
      if (!existeMascota) {
        console.error("Esta mascota no existe");
        continue;
      }

      const infoMascota = await mascota.findOrganizationIdByUUID(mascotaId);
      const organizationId = infoMascota.organizationId;

      if (!organizationId) {
        console.error("No se pudo obtener el organizationId de la mascota");
        continue;
      }

      await adoptionRequest.gestionarSolicitudAdopcion(usuario, mascotaId, aceptar);

      if (aceptar) {
        const fechaAdopcion = new Date().toISOString();
        await adoptionHistory.createAdoptionRecord(usuario, mascotaId, fechaAdopcion);
        await trackingAdoption.createAdoptionTracking(usuario, mascotaId, organizationId, fechaAdopcion);

        // Obtener el ID de socket del usuario
        const socketIdUsuario = socketsPorUsuario[usuario];

        // Emitir notificación solo al usuario que solicitó la adopción
        if (socketIdUsuario) {
          io.to(socketIdUsuario).emit("notificacion2", {
            mensaje: "¡Felicidades! Tu solicitud de adopción ha sido aceptada.",
            aceptar: true,
          });
        }
      } else {
        // Obtener el ID de socket del usuario
        const socketIdUsuario = socketsPorUsuario[usuario];

        // Emitir notificación solo al usuario que solicitó la adopción
        if (socketIdUsuario) {
          io.to(socketIdUsuario).emit("notificacion2", {
            mensaje: "Lamentablemente, tu solicitud de adopción ha sido rechazada.",
            aceptar: false,
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    session.close();
  }
};

export const registroOrganizacionRescate = async (req, res) => {
  const session = driver.session();
  const org = new RescueOrganization(session);
  try {
    const { usuario, password, email, descripcion, fechaFundacion, nombre, ciudad, calle, telefono} = req.body;

    const existingOrg = await org.findRescueOrganizationByUser(email, usuario);
    
    if (existingOrg) {
      return res.status(400).json({ error: 'Esta organizacion ya se encuentra registrada' });
    }

    const orgnizationData = {
      usuario,
      password,
      email,
      descripcion,
      fechaFundacion,
      nombre,
      ciudad,
      calle,
      telefono,
      isOrganization: true,
      isAdmin: false,
      creacionCuenta: new Date().toISOString(),      
    };

    const createdOrg= await org.crearOrg(orgnizationData);

    res.status(200).json({ message: 'Organización registrada exitosamente', org: createdOrg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  } finally {
    session.close();
  }
}

export const getAllAdoptionRequestsByOrganization = async (req, res) => {
  const session = driver.session();
  const { organizationId } = req.params;
  const adoptionRequest = new AdoptionRequest(session);

  try {
    //console.log('Iniciando la obtención de solicitudes para la organización:', organizationId);

    const requests = await adoptionRequest.getAllAdoptionRequestsByOrganization(organizationId);

    //console.log('Solicitudes obtenidas correctamente:', requests);

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error al obtener las solicitudes de adopción:', error);
    res.status(500).json({ error: 'Error al obtener las solicitudes de adopción', details: error.message });
  } finally {
    //console.log('Cerrando la sesión de Neo4j.');
    session.close();
  }
};

 
