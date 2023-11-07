import neo4j from 'neo4j-driver';
import Pet from '../models/Pet.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

const petId = uuidv4();

dotenv.config();


// Creación de la sesión
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const session = driver.session(process.env.NEO4J_DATABASE);


export const createPet = async (req, res) => {
    const session = driver.session();
    try {
      const pet = new Pet(session);
      const { nombre, categoria, descripcion, edad, sexo, color, tamaño, fotos, ubicacion, fechaPublicacion } = req.body;
  
      // Verifica que se proporcionen todas las propiedades obligatorias
      if (!nombre || !categoria || !descripcion || !edad || !sexo) {
        return res.status(400).json({ error: 'Faltan propiedades obligatorias' });
      }
  
      // Genera un ID único para la mascota
      const petId = uuidv4();
  
      // Crea un objeto de propiedades con las propiedades deseadas, incluyendo el ID
      const petProperties = {
        id: petId,
        nombre,
        categoria,
        descripcion,
        edad,
        sexo,
        color,
        tamaño,
        fotos,
        ubicacion,
        fechaPublicacion,
        estadoAdopcion: 'Disponible',
      };
  
      const newPet = await pet.createPet(petProperties);
  
      res.status(201).json(newPet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la mascota' });
    } finally {
      session.close();
    }
  };
  

  export const getPetByUUID = async (req, res) => {
    const session = driver.session();
    try {
      const pet = new Pet(session);
      const { uuid } = req.params;
  
      // Realiza una búsqueda en la base de datos por el UUID
      const foundPet = await pet.findPetByUUID(uuid);
  
      if (foundPet) {
        res.status(200).json(foundPet);
      } else {
        res.status(404).json({ error: 'Mascota no encontrada' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la mascota' });
    } finally {
      session.close();
    }
  };

  export const updatePet = async (req, res) => {
    const session = driver.session();
    try {
      const pet = new Pet(session);
      const { uuid } = req.params;
      const updatedProperties = req.body;
  
      const foundPet = await pet.findPetByUUID(uuid);
  
      if (!foundPet) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
  
      const updatedPet = await pet.updatePet(uuid, updatedProperties);
  
      res.status(200).json(updatedPet);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la mascota' });
    } finally {
      session.close();
    }
  };
  

  export const deletePet = async (req, res) => {
    const session = driver.session();
    try {
      const pet = new Pet(session);
      const petId = req.params.id; 
  
      await pet.deletePet(petId);
  
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la mascota' });
    } finally {
      session.close();
    }
  };


