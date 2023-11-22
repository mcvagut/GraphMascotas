import neo4j from 'neo4j-driver';
import Pet from '../models/Pet.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import RescueOrganization from '../models/RescueOrganization.js';
import Categoria from '../models/Category.js';

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
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acceso no autorizado. Se requiere rol de administrador.' });
    }

    const pet = new Pet(session);
    const rescueOrganization = new RescueOrganization(session);
    const { nombre, categoria, raza, descripcion, edad, sexo, color, tamaño, fotos, ubicacion, fechaPublicacion } = req.body;

    console.log('Buscando mascota existente...');
    const mascotaExistente = await pet.findPetByInfo({
      nombre,
      categoria,
      raza,
      edad,
      sexo,
      color,
      tamaño,
      ubicacion
    });

    if (mascotaExistente) {
      return res.status(400).json({ error: 'Ya existe una mascota con la misma información.' });
    }

    const organizationId = req.body.organizationId;
    const petId = uuidv4();
    const petProperties = {
      mascotaId: petId,
      nombre,
      categoria,
      raza,
      descripcion,
      edad,
      sexo,
      color,
      tamaño,
      fotos,
      ubicacion,
      organizationId: req.body.organizationId,
      fechaPublicacion: new Date().toISOString(),
      fechaAdopcion: null,
      estadoAdopcion: 'Disponible',
    };

    console.log('Creando mascota en Neo4j...');
    const newPet = await pet.createPet(petProperties);
    console.log('Mascota creada exitosamente:', newPet);

    console.log('Obteniendo detalles de la organización...');
    const orgNode = await rescueOrganization.findOnlyById(organizationId);

    if (!orgNode) {
      return res.status(404).json({ error: 'Organización de rescate no encontrada' });
    }

    console.log('Agregando la mascota a la organización y creando la conexión PONE_EN_ADOPCION...');
    await rescueOrganization.agregarMascota(orgNode, newPet.mascotaId);

    res.status(201).json(newPet);
  } catch (error) {
    console.error('Error al crear la mascota:', error);
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
      const categoriaModel = new Categoria(session);
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


  export const obtenerCategorias = async (req, res) => {
    const session = driver.session();
    try {
      const categoriaModel = new Categoria(session);
      const categorias = await categoriaModel.obtenerCategorias();
      res.status(200).json(categorias);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    }finally {
      session.close();
    }
  };
  
  export const crearCategoria = async (req, res) => {
    const session = driver.session();
  
    try {
      const categoriaModel = new Categoria(session);
      const { tipo } = req.body;
      if (!tipo) {
        return res.status(400).json({ error: 'El campo "tipo" es requerido.' });
      }
      
      await categoriaModel.crearCategoria(tipo);
      
      res.status(201).json({ message: 'Categoría creada exitosamente.' });    
    }catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({ error: 'Error al crear categoría' });
    }finally {
      session.close();
    }
  };

  export const getPetsByCategory = async (req, res) => {
    const session = driver.session();
    try {
      const petCategory = new Pet(session);
      const categoria = req.params.categoria;
      // Realiza la lógica necesaria para obtener las mascotas por la categoría
      const mascotas = await petCategory.obtenerMascotasPorCategoria(categoria);
      
      res.status(200).json(mascotas);
    } catch (error) {
      console.error("Error al obtener mascotas por categoría:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }finally {
      session.close();
    }
  };

 
  export const getAllPetsByUUID = async (req, res) => {
    const session = driver.session();
    try {
      const pet = new Pet(session);
      const { uuid } = req.params;
  
      // Realiza una búsqueda en la base de datos por el UUID
      const foundPet = await pet.getAllPetsByUUID(uuid);
  
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
  }

  export const getAllPetsByOrganizationId = async (req, res) => {
    const session = driver.session();
    try {
      const pet = new Pet(session);
      const { organizationId } = req.params;

      const foundPets = await pet.getAllPetsByOrganizationId(organizationId);
  
      if (foundPets.length > 0) {
        res.status(200).json(foundPets);
      } else {
        res.status(404).json({ error: 'No se encontraron mascotas para la organización' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las mascotas' });
    } finally {
      session.close();
    }
  };
  
  




