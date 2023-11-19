import neo4j from 'neo4j-driver';
import RescueOrganization from '../models/RescueOrganization.js';
import AdoptionRequest from '../models/AdoptionRequest.js';
import Pet from '../models/Pet.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

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
    const { nombre, descripcion, ubicacion, contacto, imagenes, fechaFundacion } = req.body;

    if (!nombre || !descripcion || !ubicacion || !contacto || !imagenes || !fechaFundacion) {
      return res.status(400).json({ error: 'Faltan propiedades obligatorias' });
    }
    const id  = uuidv4();

    const organizationProperties = {
        organizationId: id ,
        nombre,
        descripcion,
        ubicacion,
        contacto,
        imagenes,
        fechaFundacion,
        estado: 'Activa',
    };

    const newOrganization = await rescueOrganization.createRescueOrganization(organizationProperties);

    res.status(201).json(newOrganization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la organización de rescate' });
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
        return res.status(404).json({ error: 'Organización de rescate no encontrada' });
      }
      const updatedOrganization = await rescueOrganization.updateRescueOrganization(organizationId, updatedProperties);
      res.status(200).json(updatedOrganization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la organización de rescate' });
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
        res.status(404).json({ error: 'Organización de rescate no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la organización de rescate' });
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
      res.status(500).json({ error: 'Error al obtener las organizaciones de rescate' });
    } finally {
      session.close();
    }
  };
  
  export const deleteRescueOrganizationByUUID = async (req, res) => {
    const session = driver.session();
    try {
      const rescueOrganization = new RescueOrganization(session);
      const { organizationId } = req.params; // Suponiendo que el UUID se pasa como parámetro en la URL
  
      const success = await rescueOrganization.deleteRescueOrganization(organizationId);
  
      if (success) {
        res.json({ message: 'Organización de rescate eliminada exitosamente' });
      } else {
        res.status(404).json({ error: 'Organización de rescate no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la organización de rescate' });
    } finally {
      session.close();
    }
  };

  export const addPetToAdoptionList = async (req, res) => {
    const session = driver.session();

    try{
        const organization = new RescueOrganization(session);
        const pet = new Pet(session);

        const { organizationId, uuid, estadoAdopcion  } = req.body;

        const orgNode = await organization.findOnlyById(organizationId);
        const petNode = await pet.findOnlyByUUID(uuid, estadoAdopcion);

        if(!orgNode){
            return res.status(404).json({ error: 'Organización de rescate no encontrada' });
        }
        if(!petNode){
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        await organization.addPetToAdoptionList(orgNode, petNode);

    res.status(200).json({ message: 'Mascota puesta en Adopción Exitósamente!' });
        
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error al agregar la mascota a la lista de adopción' });
    }
  }

  export const gestionarSolicitudesAdopcion = async (req, res) => {
    const session = driver.session();
  
    try {
      const { usuario, mascotaId, aceptar } = req.body;
      const adoptionRequest = new AdoptionRequest(session);
  
      await adoptionRequest.gestionarSolicitudAdopcion(usuario, mascotaId, aceptar);
  
      res.status(200).json({ message: 'Solicitud de adopción gestionada exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al gestionar la solicitud de adopción' });
    } finally {
      session.close();
    }
  };
  
  